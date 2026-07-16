from passlib.context import CryptContext

from jose import jwt
from datetime import datetime, timedelta

from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

from app.database import SessionLocal
from app import models

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

SECRET_KEY = "temporary-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

def create_access_token(data: dict):
    to_encode = data.copy()
    
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        db = SessionLocal()

        user = db.query(models.User).filter(
            models.User.username == username
        ).first()

        if user is None:
            raise HTTPException(
                status_code=401,
                    detail="User not found"
            )       

        return user

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
def require_admin(
    current_user = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admins only"
        )

    return current_user

def require_manager_or_admin(
    current_user = Depends(get_current_user)
):
    if current_user.role not in ["manager", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Managers or admins only"
        )

    return current_user

def require_non_guest(
    current_user = Depends(get_current_user)
):
    if current_user.role == "guest":
        raise HTTPException(
            status_code=403,
            detail="Guest users have read-only access"
            detail="Guest users have read-only access"
        )

    return current_user