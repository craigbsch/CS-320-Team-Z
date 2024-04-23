from fastapi.testclient import TestClient
from datetime import datetime, timedelta
import sys
from pathlib import Path

# Add the project root directory to the path
root_dir = str(Path(__file__).resolve().parents[1])  
sys.path.append(root_dir)
from function_app import app





client = TestClient(app)


def get_recent_sunday():
    today = datetime.now()
    return today - timedelta(days=today.weekday() + 2)

def test_menu_valid_date():
    recent_sunday = datetime.now().strftime("%Y-%m-%d")
    response = client.get(f"/menu?dining_hall=worcester&date_served={recent_sunday}")
    assert response.status_code == 200
    assert response.json() != []

def test_menu_old_date():
    invalid_date = (get_recent_sunday() - timedelta(days=7)).strftime("%Y-%m-%d")
    response = client.get(f"/menu?dining_hall=worcester&date_served={invalid_date}")
    assert response.status_code == 404
    assert "Invalid date: Date is before the most recent scrape" in response.json().get("detail", {}).get("error", "")

def test_menu_invalid_date():
    invalid_date = "12-25-2004"
    response = client.get(f"/menu?dining_hall=worcester&date_served={invalid_date}")
    assert response.status_code == 404
    assert "Invalid date: Date should be in the form of yyyy-mm-dd" in response.json().get("detail", {}).get("error", "")

def test_menu_no_breakfast_berkshire():
    today = datetime.now().strftime("%Y-%m-%d")
    response = client.get(f"/menu?dining_hall=berkshire&date_served={today}")
    meals = response.json()
    assert response.status_code == 200
    assert all(meal['meal_type'] != 'breakfast_menu' for meal in meals)

def test_db_connection_success():
    response = client.get("/menu/testdb")
    assert response.status_code == 200
    assert response.json() == {"success": True, "result": {'1': 1}}

def test_db_connection_failure():
    # simulate a database failure here
    # TODO
    pass
