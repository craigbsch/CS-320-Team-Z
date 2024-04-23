from typing import List
from fastapi import APIRouter, Depends
from dependencies import get_token_auth_header
from models import Meal
from database import get_db_connection
from config import DATABASE_NUTRITION_TABLE



router = APIRouter()

@router.get("/api/public")
async def public():
    return {"message": "Hello from a public endpoint! You don't need to be authenticated to see this."}

@router.get("/api/private")
async def private(current_user: dict = Depends(get_token_auth_header)):
    return current_user

@router.post("/api/update_meals")
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
