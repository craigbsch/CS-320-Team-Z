from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dependencies import get_token_auth_header
from routes import router

app = FastAPI()

# CORS setup
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
