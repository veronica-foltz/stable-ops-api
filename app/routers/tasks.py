from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models
from app.schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    status: str = None,
    employee_id: int = None,
    horse_id: int = None,
    sort_by: str = Query(
        None,
        pattern="^(title|status)$"
    ),
    order: str = Query(
        "asc",
        pattern="^(asc|desc)$"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(models.Task)

    if status:
        query = query.filter(models.Task.status == status)

    if employee_id:
        query = query.filter(models.Task.employee_id == employee_id)

    if horse_id:
        query = query.filter(models.Task.horse_id == horse_id)

    if sort_by == "title":
        if order == "desc":
            query = query.order_by(models.Task.title.desc())
        else:
            query = query.order_by(models.Task.title.asc())

    if sort_by == "status":
        if order == "desc":
            query = query.order_by(models.Task.status.desc())
        else:
            query = query.order_by(models.Task.status.asc())

    return query.offset(skip).limit(limit).all()

@router.post("/tasks", response_model=TaskResponse)
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

@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/tasks/{task_id}", response_model=TaskResponse)
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