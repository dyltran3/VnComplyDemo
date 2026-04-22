import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# --- Supabase PostgreSQL connection ---
# Set SUPABASE_DB_URL in your .env file.
# Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL", "")

# Fallback to SQLite for local dev without Supabase
DATABASE_URL = SUPABASE_DB_URL if SUPABASE_DB_URL else os.getenv(
    "DATABASE_URL", "sqlite:///./vncomply.db"
)

# SQLAlchemy connect_args differ between SQLite and Postgres
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
