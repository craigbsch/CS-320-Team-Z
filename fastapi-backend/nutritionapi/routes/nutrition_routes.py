from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, Path, Body
from datetime import datetime
from include.dependencies import get_token_auth_header
from include.models import Meal
from include.database import get_db_connection
from include.config import DATABASE_NUTRITION_TABLE

router = APIRouter(tags=["Nutrition Information"])


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
            SELECT meal_id, date, meal_name, calories, carbohydrates, fat, protein, meal_type
            FROM {DATABASE_NUTRITION_TABLE}
            WHERE user_id = %s AND date = %s
            """
            cursor.execute(sql, (user_id, date))
            meals_data = cursor.fetchall()
    finally:
        connection.close()

    return {"user_id": user_id, "date": date, "meals": meals_data}



@router.delete('/api/delete_meal/{meal_id}')
async def delete_meals(meal_id: int = Path(...), current_user: dict = Depends(get_token_auth_header)):
    """
    Deletes a specific meal entry from the database based on its meal ID.

    Args:
        meal_id (int): The row ID of the meal to be deleted. Required path parameter.
        current_user (dict): Current user details, fetched from the authentication header.

    Returns:
        dict: A status message indicating the success or failure of the delete operation.
    """
    user_id = current_user['uid']
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = f"""
            DELETE FROM {DATABASE_NUTRITION_TABLE}
            WHERE meal_id = %s AND user_id = %s
            """
            cursor.execute(sql, (meal_id, user_id))
            connection.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="No meal found with the given ID for this user.")
    finally:
        connection.close()

    return {"status": "success", "message": "Meal deleted successfully"}



@router.put('/api/update_meal/{meal_id}')
async def update_meal(meal_id: int = Path(..., title="The ID of the meal to update", description="Must be a valid meal ID", examples=123),
                      meal: Meal = Body(...),
                      current_user: dict = Depends(get_token_auth_header)):
    """
    Updates an existing meal entry in the database based on its row ID.

    Args:
        meal_id (int): The row ID of the meal to be updated. This is a path parameter.
        meal (Meal): The updated meal data to be stored. This data replaces the existing meal data.
        current_user (dict): Current user details, fetched from the authentication header.

    Returns:
        dict: A status message indicating the success or failure of the update operation.
    """
    user_id = current_user['uid']
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Check if meal exists for the given user and ID
            check_sql = f"SELECT 1 FROM {DATABASE_NUTRITION_TABLE} WHERE meal_id = %s AND user_id = %s"
            cursor.execute(check_sql, (meal_id, user_id))
            exists = cursor.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Meal not found with the given ID for this user.")

            # Update the meal
            update_sql = f"""
            UPDATE {DATABASE_NUTRITION_TABLE}
            SET date = %s, meal_name = %s, calories = %s, carbohydrates = %s, fat = %s, protein = %s, meal_type = %s
            WHERE meal_id = %s AND user_id = %s
            """
            cursor.execute(update_sql, (
                meal.date_served,
                meal.meal_name,
                meal.calories,
                meal.carbohydrates,
                meal.fat,
                meal.protein,
                meal.meal_type,
                meal_id,
                user_id
            ))
            connection.commit()
    finally:
        connection.close()

    return {"status": "success", "message": "Meal updated successfully"}





@router.get('/api/get_macronutrients')
async def get_macronutrients(nutrient_type: str = Query(..., enum=["calories", "carbohydrates", "fat", "protein"], description="The type of macronutrient to fetch"),
                             current_user: dict = Depends(get_token_auth_header)):
    """
    Fetches timestamped values of a specified macronutrient from the database for an authenticated user.

    Args:
        nutrient_type (str): The type of macronutrient to retrieve. Valid options are "calories", "carbohydrates", "fat", or "protein".
        current_user (dict): Current user details, fetched from the authentication header.

    Returns:
        dict: A dictionary containing the user's ID, the requested nutrient type, and a list of dates and corresponding nutrient values.
    """
    user_id = current_user['uid']
    connection = get_db_connection()
    nutrient_data = []
    try:
        with connection.cursor() as cursor:
            sql = f"""
            SELECT date, {nutrient_type}
            FROM {DATABASE_NUTRITION_TABLE}
            WHERE user_id = %s
            ORDER BY date
            """
            cursor.execute(sql, (user_id,))
            nutrient_data = cursor.fetchall()
    finally:
        connection.close()

    return {"user_id": user_id, "nutrient_type": nutrient_type, "nutrient_values": nutrient_data}


