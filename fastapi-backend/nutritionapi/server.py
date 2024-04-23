import json
from urllib.request import urlopen
import os
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request, Security
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2AuthorizationCodeBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import List, Optional
import pymysql.cursors





# Configuration
AUTH0_DOMAIN = 'dev-dvb6li7z8kj02il0.us.auth0.com'
API_AUDIENCE = 'https://nutrition/info'  
ALGORITHMS = ["RS256"]



# Load environment variables from .env file
# Get the path to the directory this file is in
BASEDIR = os.path.abspath(os.path.join(os.path.dirname(__file__)))

# Join the path with env file
load_dotenv(os.path.join(BASEDIR, 'dbInfo.env'))

# Database connection details from environment variables
DATABASE_URL = os.getenv('DATABASE_URL')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_NUTRITION_TABLE = os.getenv('DATABASE_NUTRITION')
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

    """Establishes a database connection using pymysql.

    Returns:
        pymysql.connections.Connection: A pymysql connection object.
    """


    return pymysql.connect(
        port=3306,
        host = DATABASE_URL,
        user = DATABASE_USERNAME,
        password = DATABASE_PASSWORD,
        database = DATABASE_NAME,
        cursorclass = pymysql.cursors.DictCursor,
        autocommit = True
    )



app = FastAPI()

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"https://{AUTH0_DOMAIN}/authorize",
    tokenUrl=f"https://{AUTH0_DOMAIN}/oauth/token"
)

# Custom exception for auth errors
class AuthError(Exception):
    def __init__(self, error: dict, status_code: int):
        self.error = error
        self.status_code = status_code

@app.exception_handler(AuthError)
async def auth_exception_handler(request: Request, exc: AuthError):
    return JSONResponse(status_code=exc.status_code, content=exc.error)


# Dependency to get the token and validate it
def get_token_auth_header(token: str = Depends(oauth2_scheme)):
    try:
        # Fetch the public key from Auth0
        jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
        # Validate the token using the rsa_key
        payload = jwt.decode(
            token, rsa_key, algorithms=ALGORITHMS,
            audience=API_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unable to parse authentication token.")


@app.get("/api/public")
async def public():
    return {"message": "Hello from a public endpoint! You don't need to be authenticated to see this."}

@app.get("/api/private")
async def private(current_user: dict = Depends(get_token_auth_header)):
    return current_user



class Meal(BaseModel):
    meal_id: int
    meal_name: str
    date_served: str
    calories: float
    carbohydrates: float
    fat: float
    protein: float
    allergens: object
    dining_hall: str
    meal_type: str

@app.post("/api/update_meals")
async def update_meals(meals: List[Meal], current_user: dict = Depends(get_token_auth_header)):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            for meal in meals:
                sql = f"""
                INSERT INTO {DATABASE_NUTRITION_TABLE} (user_id, date, meal_name, calories, carbohydrates, fat, protein, meal_type)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    current_user['uid'],
                    meal.date_served,
                    meal.meal_name,
                    meal.calories,
                    meal.carbohydrates,
                    meal.fat,
                    meal.protein,
                    meal.meal_type
                ))
        connection.commit()
    finally:
        connection.close()
    return {"status": "success", "message": "Meals updated successfully"}







# update user metadata
# -- height, weight, gender

# post
# -- Updates database with meal info and user_id info

# get
# -- Take user info and find corresponding meals filtered by date