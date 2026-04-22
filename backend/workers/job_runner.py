import asyncio
import logging
import datetime
import uuid
import os
from sqlalchemy.orm import Session

from database.connection import SessionLocal
from database.models import Scan, Finding, Report
from scanners.privacy_scanner import run_privacy_scan
from scanners.nlp_analyzer import analyze_policy
from scanners.owasp_scanner import run_owasp_scan
from report_engine.report_builder import build_report_data, render_html, render_pdf

logger = logging.getLogger(__name__)

REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)


class JobQueue:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(JobQueue, cls).__new__(cls)
            cls._instance.queue = asyncio.Queue()
            cls._instance.is_running = False
            cls._instance.workers = []
        return cls._instance

    async def add_job(self, scan_id: str):
        await self.queue.put(scan_id)
        
    async def worker(self):
        while self.is_running:
            try:
                scan_id_str = await self.queue.get()
                logger.info(f"Starting background job for scan_id: {scan_id_str}")
                
                db: Session = SessionLocal()
                try:
                    scan = db.query(Scan).filter(Scan.id == uuid.UUID(scan_id_str)).first()
                    if not scan:
                        logger.error(f"Scan not found: {scan_id_str}")
                        self.queue.task_done()
                        continue
                    
                    # 1. Update status
                    scan.status = "running"
                    scan.started_at = datetime.datetime.utcnow()
                    scan.progress = 5
                    db.commit()

                    target_url = scan.target_url
                    scan_type  = scan.scan_type

                    privacy_findings = []
                    security_findings = []
                    nlp_result = None

                    # 2. Run Privacy / Cookie Scanner (Phase 3a)
                    if scan_type in ("privacy", "full"):
                        scan.progress = 10
                        db.commit()
                        logger.info(f"Running privacy scan on {target_url}")
                        res = await run_privacy_scan(target_url)
                        privacy_findings = [f.__dict__ for f in res.findings]
                        scan.progress = 40
                        db.commit()

                    # 3. Run NLP Policy Analyzer (Phase 3b)
                    if scan_type in ("privacy", "full"):
                        logger.info(f"Running NLP policy analysis on {target_url}")
                        nlp_res = await analyze_policy(target_url)
                        nlp_result = {
                            "compliance_score": nlp_res.compliance_score,
                            "summary":          nlp_res.summary,
                            "violations":      [v.__dict__ for v in nlp_res.violations]
                        }
                        scan.progress = 60
                        db.commit()

                    # 4. Run OWASP Security Scanner (Phase 4)
                    if scan_type in ("security", "full"):
                        logger.info(f"Running OWASP scan on {target_url}")
                        res = await run_owasp_scan(target_url)
                        security_findings = [f.__dict__ for f in res.findings]
                        scan.progress = 85
                        db.commit()

                    # 5. Save Findings to DB
                    for f_data in privacy_findings:
                        finding = Finding(
                            scan_id=scan.id,
                            category="privacy",
                            subcategory=f_data.get("subcategory"),
                            severity=f_data.get("severity"),
                            title=f_data.get("title"),
                            description=f_data.get("description"),
                            evidence=f_data.get("evidence"),
                            url=f_data.get("url"),
                            nd13_ref=f_data.get("nd13_ref"),
                            law91_ref=f_data.get("law91_ref")
                        )
                        db.add(finding)

                    for f_data in security_findings:
                        finding = Finding(
                            scan_id=scan.id,
                            category="owasp",
                            subcategory=f_data.get("subcategory"),
                            severity=f_data.get("severity"),
                            title=f_data.get("title"),
                            description=f_data.get("description"),
                            evidence=f_data.get("evidence"),
                            url=f_data.get("url"),
                            cvss_score=f_data.get("cvss_score"),
                            owasp_ref=f_data.get("owasp_ref")
                        )
                        db.add(finding)
                    
                    db.commit()

                    # 6. Generate Report Engine Data (Phase 5)
                    report_data = build_report_data(
                        scan_id=str(scan.id),
                        target_url=target_url,
                        scan_type=scan_type,
                        privacy_findings=privacy_findings,
                        security_findings=security_findings,
                        nlp_result=nlp_result
                    )

                    # 6.1 Generate HTML and PDF files
                    html_content = render_html(report_data)
                    report_path_html = f"{REPORTS_DIR}/{scan.id}.html"
                    report_path_pdf = f"{REPORTS_DIR}/{scan.id}.pdf"
                    
                    with open(report_path_html, "w", encoding="utf-8") as f:
                        f.write(html_content)
                    
                    # Optional: Render PDF if weasyprint is available
                    pdf_success = render_pdf(html_content, report_path_pdf)

                    report = Report(
                        scan_id=scan.id,
                        privacy_score=report_data.privacy_score,
                        security_score=report_data.security_score,
                        overall_score=report_data.overall_score,
                        risk_level=report_data.risk_level,
                        html_url=report_path_html,
                        pdf_url=report_path_pdf if pdf_success else None,
                        summary=report_data.nlp_summary
                    )
                    db.add(report)

                    # 7. Finalize Scan
                    scan.status = "completed"
                    scan.progress = 100
                    scan.finished_at = datetime.datetime.utcnow()
                    db.commit()
                    logger.info(f"Finished background job for scan_id: {scan_id_str}")

                except Exception as e:
                    logger.error(f"Error processing scan {scan_id_str}: {e}")
                    # Re-bind session if needed
                    err_db = SessionLocal()
                    try:
                        scan = err_db.query(Scan).filter(Scan.id == uuid.UUID(scan_id_str)).first()
                        if scan:
                            scan.status = "failed"
                            scan.error_msg = str(e)
                            err_db.commit()
                    finally:
                        err_db.close()
                finally:
                    db.close()

                
                self.queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Fatal error in worker: {e}")

    def start_workers(self, num_workers=2):
        self.is_running = True
        for _ in range(num_workers):
            task = asyncio.create_task(self.worker())
            self.workers.append(task)

    async def stop_workers(self):
        self.is_running = False
        for task in self.workers:
            task.cancel()
        await asyncio.gather(*self.workers, return_exceptions=True)
        self.workers = []

job_queue = JobQueue()
