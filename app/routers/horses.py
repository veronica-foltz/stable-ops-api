from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models
from app.schemas import HorseCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/horses")
def get_horses(db: Session = Depends(get_db)):
    return db.query(models.Horse).all()

@router.get("/horses/{horse_id}")
def get_horse(horse_id: int, db: Session = Depends(get_db)):
    horse = db.query(models.Horse).filter(
        models.Horse.id == horse_id
    ).first()

    if horse is None:
        raise HTTPException(status_code=404, detail="Horse not found")

    return horse

@router.post("/horses")
def create_horse(horse: HorseCreate, db: Session = Depends(get_db)):

    db_horse = models.Horse(
        name=horse.name,
        breed=horse.breed
    )

    db.add(db_horse)
    db.commit()
    db.refresh(db_horse)

    return db_horse