from fastapi import FastAPI, Query
import pymysql.cursors
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import azure.functions as func


# Load environment variables from .env file
# Get the path to the directory this file's parent is in
BASEDIR = os.path.abspath(os.path.join(os.path.dirname(__file__)))

# Join the path with env file
load_dotenv(os.path.join(BASEDIR, 'dbInfo.env'))

# Database connection details from environment variables
DATABASE_URL = os.getenv('DATABASE_URL')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_MEAL_TABLE = os.getenv('DATABASE_MEAL')
app = FastAPI()

#CORS setup
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    return pymysql.connect(
        port=3306,
        host = DATABASE_URL,
        user = DATABASE_USERNAME,
        password = DATABASE_PASSWORD,
        database = DATABASE_NAME,
        cursorclass = pymysql.cursors.DictCursor,
        autocommit = True
    )

@app.get('/menu')
async def get_menu(dining_hall: str = Query(...), date_served: str = Query(...)):  # Added dining_hall as a query parameter with a default value
    with get_db_connection().cursor() as cursor:
        sql = 'SELECT * FROM meal_info WHERE dining_hall=%s AND date_served=%s'
        cursor.execute(sql, (dining_hall, date_served))  # Note the comma to make it a tuple
        result = cursor.fetchall()
    return result

@app.get("/testdb")
async def test_db_connection():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}



app = func.AsgiFunctionApp(app=app, http_auth_level=func.AuthLevel.ANONYMOUS)