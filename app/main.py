from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import SessionLocal, engine
from app import models

from app.routers import horses
from app.routers import tasks
from app.routers import employees

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(horses.router)
app.include_router(tasks.router)
app.include_router(employees.router)

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

@app.get("/employees/{employee_id}")
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee

@app.put("/employees/{employee_id}")
def update_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db)
):
    db_employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if db_employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db_employee.name = employee.name
    db_employee.role = employee.role

    db.commit()
    db.refresh(db_employee)

    return db_employee

@app.delete("/employees/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db.delete(employee)
    db.commit()

    return {"message": f"Employee {employee_id} deleted"}