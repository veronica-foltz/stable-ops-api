from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import SessionLocal, engine
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(
        title=task.title,
        status=task.status,
        horse_id=task.horse_id,
        employee_id=task.employee_id
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task

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

@app.get("/tasks/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task

@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):
    db_task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.title = task.title
    db_task.status = task.status
    db_task.horse_id = task.horse_id
    db_task.employee_id = task.employee_id

    db.commit()
    db.refresh(db_task)

    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": f"Task {task_id} deleted"}

@app.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.post("/employees")
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = models.Employee(
        name=employee.name,
        role=employee.role
    )

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    return db_employee

@app.get("/employees/{employee_id}/tasks")
def get_employee_tasks(
    employee_id: int,
    db: Session = Depends(get_db)
):

    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    return employee.tasks