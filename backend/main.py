from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.connection import engine, Base
from api.auth import router as auth_router
from api.scans import router as scans_router
from api.admin import router as admin_router
from api.business import router as business_router
from workers.job_runner import job_queue

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables
    Base.metadata.create_all(bind=engine)
    # Start background job workers
    job_queue.start_workers(num_workers=2)
    yield
    # Stop background workers on shutdown
    await job_queue.stop_workers()

app = FastAPI(title='VnComplyDemo Scanner API', lifespan=lifespan)

app.include_router(auth_router)
app.include_router(scans_router)
app.include_router(admin_router)
app.include_router(business_router)


@app.get('/')
def read_root():
    return {'message': 'Scanner Backend is running'}
