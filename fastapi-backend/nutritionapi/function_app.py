from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from include.dependencies import get_token_auth_header
from routes.menu_routes import router as menu_router
from routes.nutrition_routes import router as nutrition_router
from routes.metadata_routes import router as metadata_router
import azure.functions as func

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

app.include_router(menu_router, prefix="/menu")
app.include_router(nutrition_router, prefix="/nutrition")
app.include_router(metadata_router, prefix="/metadata")
# when running locally comment this line out
#app = func.AsgiFunctionApp(app=app, http_auth_level=func.AuthLevel.ANONYMOUS)