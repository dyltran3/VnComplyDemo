import uuid
from sqlalchemy import (
    Column, String, Boolean, Integer, Numeric,
    Text, DateTime, ForeignKey, CheckConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .connection import Base


def _uuid():
    """Default callable for UUID primary keys."""
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email         = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    full_name     = Column(String)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())


class Scan(Base):
    __tablename__ = "scans"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    target_url  = Column(String, nullable=False)
    scan_type   = Column(String, default="full")   # 'privacy' | 'security' | 'full'
    status      = Column(String, default="pending") # pending|running|completed|failed
    progress    = Column(Integer, default=0)
    error_msg   = Column(Text)
    started_at  = Column(DateTime(timezone=True))
    finished_at = Column(DateTime(timezone=True))
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("status IN ('pending','running','completed','failed')", name="ck_scan_status"),
        CheckConstraint("progress >= 0 AND progress <= 100", name="ck_scan_progress"),
    )


class Finding(Base):
    __tablename__ = "findings"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id        = Column(UUID(as_uuid=True), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    category       = Column(String, nullable=False)    # 'privacy' | 'owasp'
    subcategory    = Column(String)                    # e.g. 'A03-Injection'
    severity       = Column(String, nullable=False)    # INFO|LOW|MEDIUM|HIGH|CRITICAL
    title          = Column(String, nullable=False)
    description    = Column(Text, nullable=False)
    evidence       = Column(Text)
    screenshot_url = Column(String)
    url            = Column(String)
    cvss_score     = Column(Numeric(4, 1))
    owasp_ref      = Column(String)
    nd13_ref       = Column(String)
    law91_ref      = Column(String)
    remediation    = Column(Text)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint(
            "severity IN ('INFO','LOW','MEDIUM','HIGH','CRITICAL')",
            name="ck_finding_severity"
        ),
    )


class Report(Base):
    __tablename__ = "reports"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id        = Column(UUID(as_uuid=True), ForeignKey("scans.id", ondelete="CASCADE"), unique=True, nullable=False)
    privacy_score  = Column(Integer)
    security_score = Column(Integer)
    overall_score  = Column(Integer)
    risk_level     = Column(String)  # LOW|MEDIUM|HIGH|CRITICAL
    html_url       = Column(String)
    pdf_url        = Column(String)
    summary        = Column(Text)    # JSON blob — executive summary
    generated_at   = Column(DateTime(timezone=True), server_default=func.now())


class LegalRule(Base):
    __tablename__ = "legal_rules"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    law_ref     = Column(String, nullable=False)    # e.g. 'NĐ13/2023 - Điều 9'
    category    = Column(String, nullable=False)   # 'privacy' | 'security'
    description = Column(Text, nullable=False)
    severity    = Column(String, default="MEDIUM")
    remediation = Column(Text)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ScanSchedule(Base):
    __tablename__ = "scan_schedules"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    target_url = Column(String, nullable=False)
    frequency  = Column(String, nullable=False)    # daily, weekly, monthly
    is_active  = Column(Boolean, default=True)
    next_run   = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DPIAAssessment(Base):
    __tablename__ = "dpia_assessments"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id       = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    status        = Column(String, default="draft") # draft | completed
    data_json     = Column(Text)                    # All 5 steps data as JSON
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    actor_name = Column(String)     # For individual/unregistered or logging email
    action     = Column(String, nullable=False)
    details    = Column(Text)
    ip_address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

