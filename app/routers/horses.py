from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth import get_current_user, require_admin, require_manager_or_admin

from app.database import SessionLocal
from app import models
from app.schemas import HorseCreate, HorseResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/horses", response_model=list[HorseResponse])
def get_horses(db: Session = Depends(get_db)):
    return db.query(models.Horse).all()

@router.get("/horses/{horse_id}", response_model=HorseResponse)
def get_horse(horse_id: int, db: Session = Depends(get_db)):
    horse = db.query(models.Horse).filter(
        models.Horse.id == horse_id
    ).first()

    if horse is None:
        raise HTTPException(status_code=404, detail="Horse not found")

    return horse

@router.post("/horses")
def create_horse(horse: HorseCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(require_manager_or_admin)
    ):

    db_horse = models.Horse(
        name=horse.name,
        breed=horse.breed
    )

    db.add(db_horse)
    db.commit()
    db.refresh(db_horse)

    return db_horse

@router.put("/horses/{horse_id}")
def update_horse(
    horse_id: int,
    horse: HorseCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_manager_or_admin)
):
    db_horse = db.query(models.Horse).filter(
        models.Horse.id == horse_id
    ).first()

    if db_horse is None:
        raise HTTPException(status_code=404, detail="Horse not found")

    db_horse.name = horse.name
    db_horse.breed = horse.breed

    db.commit()
    db.refresh(db_horse)

    return db_horse

@router.delete("/horses/{horse_id}")
def delete_horse(
    horse_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    horse = db.query(models.Horse).filter(
        models.Horse.id == horse_id
    ).first()

    if horse is None:
        raise HTTPException(status_code=404, detail="Horse not found")

    db.delete(horse)
    db.commit()

    return {"message": f"Horse {horse_id} deleted"}