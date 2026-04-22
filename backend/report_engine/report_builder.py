"""
Report Builder — Phase 5
Generates HTML and PDF compliance reports from scan findings.
Includes privacy score, security score, NĐ13/2023 + Law 91/2025 compliance mapping.
"""

import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

from jinja2 import Environment, FileSystemLoader

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).parent / "templates"


# -----------------------------------------------------------------------
# Scoring weights
# -----------------------------------------------------------------------
SEVERITY_WEIGHTS = {
    "CRITICAL": 25,
    "HIGH":     15,
    "MEDIUM":   8,
    "LOW":      3,
    "INFO":     1,
}

MAX_DEDUCTION = 100  # Score starts at 100, deduct per finding


# -----------------------------------------------------------------------
# Data models for report
# -----------------------------------------------------------------------

@dataclass
class ReportFinding:
    category:    str
    severity:    str
    title:       str
    description: str
    owasp_ref:   Optional[str] = None
    nd13_ref:    Optional[str] = None
    law91_ref:   Optional[str] = None
    cvss_score:  Optional[float] = None
    remediation: Optional[str] = None


@dataclass
class ReportData:
    scan_id:          str
    target_url:       str
    scan_type:        str
    generated_at:     str
    privacy_score:    int = 0
    security_score:   int = 0
    overall_score:    int = 0
    risk_level:       str = "UNKNOWN"
    nlp_compliance_score: int = 0
    nlp_summary:      str = ""
    privacy_findings: List[ReportFinding] = field(default_factory=list)
    security_findings: List[ReportFinding] = field(default_factory=list)
    policy_violations: List[dict] = field(default_factory=list)


# -----------------------------------------------------------------------
# Score calculation
# -----------------------------------------------------------------------

def calculate_score(findings: List[ReportFinding]) -> int:
    """Calculate score (0-100) based on findings severity."""
    deduction = sum(SEVERITY_WEIGHTS.get(f.severity, 0) for f in findings)
    score = max(0, 100 - deduction)
    return score


def determine_risk_level(overall_score: int) -> str:
    if overall_score >= 80:
        return "LOW"
    elif overall_score >= 60:
        return "MEDIUM"
    elif overall_score >= 40:
        return "HIGH"
    return "CRITICAL"


# -----------------------------------------------------------------------
# Report generation
# -----------------------------------------------------------------------

def build_report_data(
    scan_id: str,
    target_url: str,
    scan_type: str,
    privacy_findings: list,
    security_findings: list,
    nlp_result: Optional[dict] = None,
) -> ReportData:
    """Build a ReportData object from raw scan results."""
    import datetime

    priv_list = [
        ReportFinding(
            category="privacy",
            severity=f.get("severity", "MEDIUM"),
            title=f.get("title", ""),
            description=f.get("description", ""),
            nd13_ref=f.get("nd13_ref"),
            law91_ref=f.get("law91_ref"),
            remediation=f.get("remediation"),
        )
        for f in privacy_findings
    ]

    sec_list = [
        ReportFinding(
            category="owasp",
            severity=f.get("severity", "MEDIUM"),
            title=f.get("title", ""),
            description=f.get("description", ""),
            owasp_ref=f.get("owasp_ref"),
            cvss_score=f.get("cvss_score"),
            remediation=f.get("remediation"),
        )
        for f in security_findings
    ]

    privacy_score  = calculate_score(priv_list)
    security_score = calculate_score(sec_list)
    nlp_score      = (nlp_result or {}).get("compliance_score", 100)

    # Weighted average: privacy 40%, NLP 30%, security 30%
    overall_score = int(
        privacy_score  * 0.40 +
        nlp_score      * 0.30 +
        security_score * 0.30
    )

    return ReportData(
        scan_id=scan_id,
        target_url=target_url,
        scan_type=scan_type,
        generated_at=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        privacy_score=privacy_score,
        security_score=security_score,
        overall_score=overall_score,
        risk_level=determine_risk_level(overall_score),
        nlp_compliance_score=nlp_score,
        nlp_summary=(nlp_result or {}).get("summary", ""),
        privacy_findings=priv_list,
        security_findings=sec_list,
        policy_violations=(nlp_result or {}).get("violations", []),
    )


def render_html(report: ReportData) -> str:
    """Render the HTML report from Jinja2 template."""
    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    try:
        template = env.get_template("report.html")
        return template.render(report=report)
    except Exception as e:
        logger.error(f"Failed to render HTML report: {e}")
        raise


def render_pdf(html_content: str, output_path: str) -> bool:
    """Render HTML to PDF using WeasyPrint."""
    try:
        from weasyprint import HTML
        HTML(string=html_content).write_pdf(output_path)
        logger.info(f"PDF written to {output_path}")
        return True
    except Exception as e:
        logger.error(f"WeasyPrint PDF generation failed: {e}")
        return False
