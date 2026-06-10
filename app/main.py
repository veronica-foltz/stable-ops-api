from fastapi import FastAPI, Depends
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