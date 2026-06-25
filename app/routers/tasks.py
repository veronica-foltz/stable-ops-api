from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models
from app.schemas import TaskCreate, TaskUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@router.post("/tasks")
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

@router.get("/tasks/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/tasks/{task_id}")
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

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": f"Task {task_id} deleted"}