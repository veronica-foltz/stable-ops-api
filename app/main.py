from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import SessionLocal, engine
from app import models

from app.routers import horses
from app.routers import tasks
from app.routers import employees
from app.routers import users

from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(horses.router)
app.include_router(tasks.router)
app.include_router(employees.router)
app.include_router(users.router)

class HorseCreate(BaseModel):
    name: str
    breed: str

class TaskCreate(BaseModel):
    title: str
    status: str = "Pending"
    horse_id: int
    employee_id: int

class TaskUpdate(BaseModel):
    title: str
    status: str
    horse_id: Optional[int] = None
    employee_id: Optional[int] = None

class EmployeeCreate(BaseModel):
    name: str
    role: str

class EmployeeUpdate(BaseModel):
    name: str
    role: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Stable Ops API is running"}

@app.get("/horses/{horse_id}/tasks")
def get_horse_tasks(
    horse_id: int,
    db: Session = Depends(get_db)
):
    horse = db.query(models.Horse).filter(
        models.Horse.id == horse_id
    ).first()

    if horse is None:
        raise HTTPException(status_code=404, detail="Horse not found")

    return horse.tasks

