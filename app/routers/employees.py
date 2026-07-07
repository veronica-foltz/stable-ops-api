from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth import get_current_user

from app.database import SessionLocal
from app import models
from app.schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/employees", response_model=list[EmployeeResponse])
def get_employees(
    role: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Employee)

    if role:
        query = query.filter(models.Employee.role == role)

    return query.all()

@router.post("/employees", response_model=EmployeeResponse)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
    ):
    db_employee = models.Employee(
        name=employee.name,
        role=employee.role
    )

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    return db_employee

@router.get("/employees/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    return employee

@router.put("/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    db_employee.name = employee.name
    db_employee.role = employee.role

    db.commit()
    db.refresh(db_employee)

    return db_employee

@router.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
    ):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()

    return {"message": f"Employee {employee_id} deleted"}

@router.get("/employees/{employee_id}/tasks")
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