from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

class HorseCreate(BaseModel):
    name: str
    breed: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Stable Ops API is running"}

@app.get("/horses")
def get_horses(db: Session = Depends(get_db)):
    return db.query(models.Horse).all()

@app.get("/horses/{horse_id}")
def get_horse(horse_id: int, db: Session = Depends(get_db)):
    horse = db.query(models.Horse).filter(models.Horse.id == horse_id).first()

    if horse is None:
        raise HTTPException(status_code=404, detail="Horse not found")

    return horse

@app.post("/horses")
def create_horse(horse: HorseCreate, db: Session = Depends(get_db)):
    db_horse = models.Horse(
        name=horse.name,
        breed=horse.breed
    )

    db.add(db_horse)
    db.commit()
    db.refresh(db_horse)

    return db_horse

@app.put("/horses/{horse_id}")
def update_horse(
    horse_id: int,
    horse: HorseCreate,
    db: Session = Depends(get_db)
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

@app.delete("/horses/{horse_id}")
def delete_horse(
    horse_id: int,
    db: Session = Depends(get_db)
):

    horse = db.query(models.Horse).filter(
        models.Horse.id == horse_id
    ).first()

    if horse is None:
        raise HTTPException(status_code=404, detail="Horse not found")

    db.delete(horse)
    db.commit()

    return {"message": f"Horse {horse_id} deleted"}