from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import psutil
import datetime

from database.connection import get_db
from database.models import LegalRule, AuditLog, Scan

router = APIRouter(prefix="/api/admin", tags=["admin"])

# --- System Metrics ---
@router.get("/metrics")
async def get_system_metrics():
    """Real-time system health metrics."""
    return {
        "cpu": psutil.cpu_percent(),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent,
        "engine_status": "running",
        "active_jobs": 42, # Mock or count from DB
        "timestamp": datetime.datetime.now().isoformat()
    }

# --- Legal Rules CRUD ---
@router.get("/rules")
def list_rules(db: Session = Depends(get_db)):
    return db.query(LegalRule).all()

@router.post("/rules")
def create_rule(rule_data: dict, db: Session = Depends(get_db)):
    rule = LegalRule(**rule_data)
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule

@router.put("/rules/{rule_id}")
def update_rule(rule_id: str, rule_data: dict, db: Session = Depends(get_db)):
    rule = db.query(LegalRule).filter(LegalRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    for key, value in rule_data.items():
        setattr(rule, key, value)
    db.commit()
    db.refresh(rule)
    return rule

@router.delete("/rules/{rule_id}")
def delete_rule(rule_id: str, db: Session = Depends(get_db)):
    rule = db.query(LegalRule).filter(LegalRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    db.delete(rule)
    db.commit()
    return {"message": "Rule deleted"}

# --- Audit Logs ---
@router.get("/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()

