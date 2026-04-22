import asyncio
import uuid
from database.connection import SessionLocal, engine, Base
from database.models import Scan
from workers.job_runner import job_queue

# Initialize DB for test environment
Base.metadata.create_all(bind=engine)

async def test_failed_scan():
    # 1. Create a dummy scan for an unreachable URL
    db = SessionLocal()
    scan = Scan(
        target_url="http://this-url-definitely-does-not-exist-at-all-1234.com",
        scan_type="full",
        status="pending"
    )
    db.add(scan)
    db.commit()
    scan_id = str(scan.id)
    print(f"Created scan {scan_id} for unreachable URL")
    db.close()

    # 2. Start workers manually
    job_queue.start_workers(num_workers=1)
    
    # 3. Add job
    await job_queue.add_job(scan_id)
    
    # 4. Wait for it to fail
    print("Waiting for scan to fail...")
    for _ in range(10):
        await asyncio.sleep(2)
        db = SessionLocal()
        s = db.query(Scan).filter(Scan.id == uuid.UUID(scan_id)).first()
        print(f"Current status: {s.status}")
        if s.status == "failed":
            print(f"SUCCESS: Scan failed as expected with error: {s.error_msg}")
            db.close()
            break
        db.close()
    else:
        print("FAILURE: Scan did not fail within 20 seconds")

    await job_queue.stop_workers()

if __name__ == "__main__":
    asyncio.run(test_failed_scan())
