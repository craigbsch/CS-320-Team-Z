from fastapi import APIRouter, Query, HTTPException
from include.database import get_db_connection
from datetime import datetime, timedelta

router = APIRouter(tags=["Menu Information"])



@router.get('')
async def get_menu(dining_hall: str = Query(...), date_served: str = Query(...)):
    """Fetches menu information from the database.

    Args:
        dining_hall (str): The name of the dining hall. Required query parameter.
        date_served (str): The date for which menu is being queried. Required query parameter.

    Returns:
        list[dict]: A list of meal information dictionaries or an error message.
    """
    # Validate the date_served to ensure it is not before the most recent scrape
    try:
        served_date = datetime.strptime(date_served, "%Y-%m-%d")
        today = datetime.today()
        last_scrape = today - timedelta(days=today.weekday() + 2)
        if served_date < last_scrape:
            raise HTTPException(status_code=404, detail={"error": "Invalid date: Date is before the most recent scrape"})
    except ValueError:
        raise HTTPException(status_code=404, detail={"error": "Invalid date: Date should be in the form of yyyy-mm-dd"})

    with get_db_connection().cursor() as cursor:
        sql = 'SELECT * FROM meal_info WHERE dining_hall=%s AND date_served=%s'
        cursor.execute(sql, (dining_hall, date_served))  # Note the comma to make it a tuple
        result = cursor.fetchall()

        for meal in result:
            allergens_list = meal['allergens'].split(', ')
            meal['allergens'] = {allergen.strip(): None for allergen in allergens_list if allergen.strip()}

    return result



@router.get('/meal_types')
async def get_meal_types(dining_hall: str = Query(...), date_served: str = Query(...)):
    """Fetches all unique meal types for a specified dining hall and date.

    Args:
        dining_hall (str): The name of the dining hall. Required query parameter.
        date_served (str): The date for which meal types are queried. Required query parameter.

    Returns:
        list[str]: A list of unique meal types or an error message.
    """
    with get_db_connection().cursor() as cursor:
        sql = 'SELECT DISTINCT meal_type FROM meal_info WHERE dining_hall=%s AND date_served=%s'
        cursor.execute(sql, (dining_hall, date_served))
        meal_types = cursor.fetchall()
        return [meal_type['meal_type'] for meal_type in meal_types]



@router.get('/valid_dates')
async def get_valid_dates(dining_hall: str = Query(...)):
    """Fetches all dates with available meal records for a specified dining hall.

    Args:
        dining_hall (str): The name of the dining hall. Required query parameter.

    Returns:
        list[str]: A list of dates in 'yyyy-mm-dd' format.
    """
    with get_db_connection().cursor() as cursor:
        sql = 'SELECT DISTINCT date_served FROM meal_info WHERE dining_hall=%s ORDER BY date_served'
        cursor.execute(sql, (dining_hall,))
        dates = cursor.fetchall()
        return [date['date_served'].strftime('%Y-%m-%d') for date in dates]


@router.get("/testdb")
async def test_db_connection():
    """Tests the database connection.

    Returns:
        dict: A dictionary indicating the success or failure of the connection attempt.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

