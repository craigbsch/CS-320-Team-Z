import os
from dotenv import load_dotenv


# Load environment variables from .env file
# Get the path to the directory this file is in
BASEDIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'),)

# Join the path with env file
load_dotenv(os.path.join(BASEDIR, 'dbInfo.env'))


# configuration
AUTH0_DOMAIN = 'dev-dvb6li7z8kj02il0.us.auth0.com'
API_AUDIENCE = 'https://nutrition/info'  
ALGORITHMS = ["RS256"]
DATABASE_URL = os.getenv('DATABASE_URL')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_NUTRITION_TABLE = os.getenv('DATABASE_NUTRITION')
DATABASE_MEAL_TABLE = os.getenv('DATABASE_MEAL')