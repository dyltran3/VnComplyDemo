"""
Scan API Router — Phase 3/4
Handles scan submission, status polling, and findings retrieval.
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, AnyHttpUrl
from typing import Literal
import uuid, datetime

from database.connection import get_db
from database.models import Scan, Finding, User
from api.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/scans", tags=["scans"])


# -----------------------------------------------------------------------
# Request / Response schemas
# -----------------------------------------------------------------------

class ScanCreate(BaseModel):
    target_url: str
    scan_type: Literal["privacy", "security", "full"] = "full"


class ScanResponse(BaseModel):
    id: str
    target_url: str
    scan_type: str
    status: str
    progress: int
    created_at: str


# -----------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------

@router.post("", response_model=ScanResponse, status_code=202)
async def create_scan(
    body: ScanCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    """Submit a new scan job."""
    user_id_val = current_user.id if current_user else None
    scan = Scan(
        target_url=body.target_url,
        scan_type=body.scan_type,
        user_id=user_id_val,
        status="pending",
        progress=0,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    # Enqueue background job
    await job_queue.add_job(str(scan.id))

    return ScanResponse(
        id=str(scan.id),
        target_url=scan.target_url,
        scan_type=scan.scan_type,
        status=scan.status,
        progress=scan.progress,
        created_at=str(scan.created_at),
    )


@router.get("", response_model=list[ScanResponse])
def list_scans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    """List all scans for the current user."""
    query = db.query(Scan)
    if current_user:
        query = query.filter(Scan.user_id == current_user.id)
    scans = query.order_by(Scan.created_at.desc()).limit(50).all()

    return [
        ScanResponse(
            id=str(s.id),
            target_url=s.target_url,
            scan_type=s.scan_type,
            status=s.status,
            progress=s.progress,
            created_at=str(s.created_at),
        )
        for s in scans
    ]


@router.get("/{scan_id}/status")
def get_scan_status(scan_id: str, db: Session = Depends(get_db)):
    """Poll scan progress."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {
        "id": str(scan.id),
        "status": scan.status,
        "progress": scan.progress,
        "error_msg": scan.error_msg,
        "started_at": str(scan.started_at) if scan.started_at else None,
        "finished_at": str(scan.finished_at) if scan.finished_at else None,
    }


@router.get("/{scan_id}/findings")
def get_findings(scan_id: str, db: Session = Depends(get_db)):
    """Get all findings for a scan."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    findings = db.query(Finding).filter(Finding.scan_id == scan_id).all()
    return [
        {
            "id": str(f.id),
            "category": f.category,
            "subcategory": f.subcategory,
            "severity": f.severity,
            "title": f.title,
            "description": f.description,
            "evidence": f.evidence,
            "url": f.url,
            "cvss_score": f.cvss_score,
            "owasp_ref": f.owasp_ref,
            "nd13_ref": f.nd13_ref,
        }
        for f in findings
    ]
