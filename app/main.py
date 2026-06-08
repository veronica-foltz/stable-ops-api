from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

horses = [
    {"id": 1, "name": "Thunder", "breed": "Quarter Horse"},
    {"id": 2, "name": "Bella", "breed": "Arabian"}
]

class Horse(BaseModel):
    name: str
    breed: str

@app.get("/")
def root():
    return {"message": "Stable Ops API is running"}

@app.get("/horses")
def get_horses():
    return horses

@app.post("/horses")

def create_horse(horse: Horse):
    new_horse = {
        "id": len(horses) + 1,
        "name": horse.name,
        "breed": horse.breed

    }

    horses.append(new_horse)

    return new_horse