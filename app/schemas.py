from pydantic import BaseModel
from typing import Optional

class HorseCreate(BaseModel):
    name: str
    breed: str

class HorseResponse(BaseModel):
    id: int
    name: str
    breed: str

    class Config:
        from_attributes = True

class TaskResponse(BaseModel):
    id: int
    title: str
    status: str
    horse_id: Optional[int] = None
    employee_id: Optional[int] = None

    class Config:
        from_attributes = True

class EmployeeResponse(BaseModel):
    id: int
    name: str
    role: str

    class Config:
        from_attributes = True

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

class UserCreate(BaseModel):
    username: str
    password: str