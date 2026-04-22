from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
import json

from database.connection import get_db
from database.models import DPIAAssessment, ScanSchedule

router = APIRouter(prefix="/api/business", tags=["business"])

# --- DPIA Wizard ---
@router.post("/dpia")
def create_dpia(data: dict, db: Session = Depends(get_db)):
    """Save a new DPIA assessment (Draft or Complete)."""
    # Assuming user_id is passed or handled by auth middleware
    assessment = DPIAAssessment(
        data_json=json.dumps(data.get("steps", {})),
        status=data.get("status", "draft")
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment

@router.get("/dpia")
def list_dpia(db: Session = Depends(get_db)):
    return db.query(DPIAAssessment).all()

# --- Scan Scheduling ---
@router.post("/schedules")
def create_schedule(data: dict, db: Session = Depends(get_db)):
    schedule = ScanSchedule(
        target_url=data["target_url"],
        frequency=data["frequency"],
        next_run=datetime.datetime.now() + datetime.timedelta(days=1) # Simple logic for demo
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule

@router.get("/schedules")
def list_schedules(db: Session = Depends(get_db)):
    return db.query(ScanSchedule).all()
