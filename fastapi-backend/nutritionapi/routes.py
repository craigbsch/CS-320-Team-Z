from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException
from datetime import datetime
from dependencies import get_token_auth_header
from models import Meal
from database import get_db_connection
from config import DATABASE_NUTRITION_TABLE



router = APIRouter()

@router.get("/api/public")
async def public():
    """
    A public endpoint that does not require authentication.

    Returns:
        dict: A welcome message that is publicly accessible.
    """
    return {"message": "Hello from a public endpoint! You don't need to be authenticated to see this."}

@router.get("/api/private")
async def private(current_user: dict = Depends(get_token_auth_header)):
    """
    A private endpoint that requires authentication.

    Args:
        current_user (dict): Current user details, fetched from the authentication header.

    Returns:
        dict: The current authenticated user's details.
    """
    return current_user

@router.post("/api/update_meals")
async def update_meals(meals: List[Meal], current_user: dict = Depends(get_token_auth_header)):
    """
    Updates meal entries in the database for an authenticated user.

    Args:
        meals (List[Meal]): A list of meals to update in the database.
        current_user (dict): Current user details, fetched from the authentication header.

    Returns:
        dict: A status message indicating the success or failure of the update operation.
    """
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


@router.get('/api/get_meals')
async def get_meals(date: str = Query(...), current_user: dict = Depends(get_token_auth_header)):
    """
    Fetches meal entries for a specific date from the database for an authenticated user.

    Args:
        date (str): The date for which meals are being queried. Required query parameter in YYYY-MM-DD format.
        current_user (dict): Current user details, fetched from the authentication header.

    Returns:
        dict: A dictionary containing user information and meal entries or an error message.
    """
    # Validate the date format and check that it is not in the future
    try:
        query_date = datetime.strptime(date, "%Y-%m-%d")
        if query_date > datetime.today():
            raise HTTPException(status_code=400, detail="Invalid date: Date cannot be in the future.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date: Date should be in the form of YYYY-MM-DD")

    user_id = current_user['uid']
    connection = get_db_connection()
    meals_data = []
    try:
        with connection.cursor() as cursor:
            sql = f"""
            SELECT date, meal_name, calories, carbohydrates, fat, protein, meal_type
            FROM {DATABASE_NUTRITION_TABLE}
            WHERE user_id = %s AND date = %s
            """
            cursor.execute(sql, (user_id, date))
            meals_data = cursor.fetchall()
    finally:
        connection.close()

    return {"user_id": user_id, "date": date, "meals": meals_data}