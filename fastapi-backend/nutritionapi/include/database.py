import pymysql.cursors
from include.config import DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME

def get_db_connection():
    return pymysql.connect(
        port=3306,
        host=DATABASE_URL,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD,
        database=DATABASE_NAME,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )
