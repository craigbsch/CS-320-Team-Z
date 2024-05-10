from dotenv import load_dotenv, find_dotenv
import os
import pymysql
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from datetime import datetime
from selenium.webdriver.chrome.options import Options

# Get the path to the directory this file's parent is in
BASEDIR = os.path.abspath(os.path.join(os.path.dirname(__file__)))
load_dotenv(os.path.join(BASEDIR, 'dbInfoDocker.env'))

def setup_browser():
    """ Set up headless Chrome browser for scraping. """
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    return driver

def setup_database():
    """ Establish database connection using environment variables. """
    return pymysql.connect(
        port=3306,
        host=os.getenv('DATABASE_URL'),
        user=os.getenv('DATABASE_USERNAME'),
        password=os.getenv('DATABASE_PASSWORD'),
        database=os.getenv('DATABASE_NAME'),
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

def convert_date(date_str):
    """ Parse date from the format like 'Wed April 03, 2024'. """
    return datetime.strptime(date_str, "%a %B %d, %Y").date()

def remove_suffix(value):
    """ Remove suffix from nutritional values and convert units. """
    if value.strip().endswith('mg'):
        return safe_convert(value.rstrip('mg'), float) / 1000
    elif value.strip().endswith('g'):
        return safe_convert(value.rstrip('g'), float)
    return safe_convert(value, float)

def safe_convert(value, target_type, default=0):
    """ Convert value to a specific type, returning default if conversion fails. """
    try:
        return target_type(value)
    except ValueError:
        return default

def parse_menu_data(driver, dining_hall):
    """ Parse menu data from the given dining hall page. """
    driver.implicitly_wait(15)
    menu_data = []
    date_dropdown = Select(driver.find_element(By.ID, 'upcoming-foodpro'))

    for index in range(len(date_dropdown.options)):
        date_dropdown.select_by_index(index)
        WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.ID, 'upcoming-foodpro')))
        content = driver.page_source
        soup = BeautifulSoup(content, 'html.parser')
        
        if not soup.select('.lightbox-nutrition a'):
            continue
        
        for type in soup.select('.panel-container div[role="tabpanel"]'):
            food_items = type.select('.lightbox-nutrition a')
            selected_date = date_dropdown.first_selected_option.text.strip()
            formatted_date = convert_date(selected_date)

            for item in food_items:
                menu_data.append({
                    'food_name': item.text.strip(),
                    'calories': safe_convert(item.get('data-calories'), float),
                    'serving_size': item.get('data-serving-size'),
                    'protein': remove_suffix(item.get('data-protein')),
                    'fats': remove_suffix(item.get('data-total-fat')),
                    'carbs': remove_suffix(item.get('data-total-carb')),
                    'allergens': item.get('data-allergens'),
                    'meal_type': type.get('id'),
                    'dining_hall': dining_hall,
                    'date_served': formatted_date
                })

    return menu_data

def clear_meal_info_table(connection):
    """ Clears the meal_info table before new data is inserted. """
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM meal_info")
        connection.commit()

def save_menu_data(connection, menu_data):
    """ Save the parsed menu data to the database. """
    with connection.cursor() as cursor:
        for item in menu_data:
            sql = "INSERT INTO meal_info (meal_name, date_served, calories, carbohydrates, fat, protein, allergens, dining_hall, meal_type, serving_size) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(sql, (
                item['food_name'], item['date_served'], item['calories'],
                item['carbs'], item['fats'], item['protein'],
                item['allergens'], item['dining_hall'], item['meal_type'],
                item['serving_size']
            ))
        connection.commit()

def fetch_and_save_menus(driver, connection, dining_halls):
    """ Main function to fetch and save menus for provided dining halls. """
    # Clear the meal_info table before new data insertion
    clear_meal_info_table(connection)
    
    for hall in dining_halls:
        driver.get(f"https://umassdining.com/locations-menus/{hall}/menu")
        menu_data = parse_menu_data(driver, hall)
        save_menu_data(connection, menu_data)

def main():
    driver = setup_browser()
    connection = setup_database()

    try:
        dining_halls = ['berkshire', 'worcester', 'franklin', 'hampshire']
        fetch_and_save_menus(driver, connection, dining_halls)
    finally:
        connection.close()
        driver.stop_client()
        driver.close()
        driver.quit()

if __name__ == "__main__":
    main()