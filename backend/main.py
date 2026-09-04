from fastapi import FastAPI
from auth import router as auth_router
from starlette.middleware.sessions import SessionMiddleware
import os
from database import base, engine
import models

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.getenv("JWT_SECRET_KEY"))

base.metadata.create_all(bind=engine)

app.include_router(auth_router)