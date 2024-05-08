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

# Join the path with env file
load_dotenv(os.path.join(BASEDIR, 'dbInfoDocker.env'))

# Database connection details from environment variables
DATABASE_URL = os.getenv('DATABASE_URL')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_MEAL_TABLE = os.getenv('DATABASE_MEAL')


chrome_options = Options()
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--headless")  # don't need a GUI
chrome_options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

dining_halls = ['berkshire', 'worcester', 'franklin', 'hampshire']

# Connect to the database
connection = pymysql.connect(
                            port=3306,
                            host=DATABASE_URL,
                             user=DATABASE_USERNAME,
                             password=DATABASE_PASSWORD,
                             database=DATABASE_NAME,
                             cursorclass=pymysql.cursors.DictCursor,
                             autocommit=True)


def convert_date(date_str):
    # Parse date from the format like "Wed April 03, 2024"
    return datetime.strptime(date_str, "%a %B %d, %Y").date()

    
def remove_suffix(value):
    # Check if the value ends with 'mg' and convert
    
    if value.strip().endswith('mg'):
        # Remove 'mg' suffix and convert remaining value to grams
        return safe_convert (value.rstrip('mg'), float) / 1000
    
    # Remove 'g' suffix from nutritional values
    elif value.strip().endswith('g'):
        return safe_convert (value.rstrip('g'), float) 
    
    return safe_convert(value, float)

def safe_convert(value, target_type, default=0): # Prevent crashing in potential edge case (i.e. not listed)
    try:
        return target_type(value)
    except ValueError:
        return default

try:
    # Connect to DB to write data
    with connection.cursor() as cursor:
        # Clear the meal_info table before inserting new data (not tracking old meals)
        cursor.execute("DELETE FROM meal_info")
        connection.commit()

        for hall in dining_halls:
            driver.get(f"https://umassdining.com/locations-menus/{hall}/menu")

            # Wait for the page to load and JavaScript to execute
            driver.implicitly_wait(15)

            # Select the drop-down for dates
            date_dropdown = Select(driver.find_element(By.ID, 'upcoming-foodpro'))

            # Iterate over the dates in the drop-down
            for index in range(len(date_dropdown.options)):
                # Select the date by index
                date_dropdown.select_by_index(index)

                # Wait for the page to load the menu for the selected date
                WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CSS_SELECTOR, '.lightbox-nutrition a')))

                # Now can interact with the page, scrape content, click buttons, etc.
                content = driver.page_source


                # Parse the HTML content of the page
                soup = BeautifulSoup(content, 'html.parser')

                #select all divs with role "tabpanel" in the 'panel-control' class
                type_id = soup.select('.panel-container div[role="tabpanel"]')

                for type in type_id:

                    # Select all items with the 'lightbox-nutrition' class
                    food_items = type.select('.lightbox-nutrition a')
                    selected_date = date_dropdown.first_selected_option.text.strip()
                    formatted_date = convert_date(selected_date)

                    for item in food_items:

                        # Select all items with the 'lightbox-nutrition' class

                        food_name = item.text.strip()
                        calories = safe_convert(item.get('data-calories'), float)
                        serving_size = item.get('data-serving-size')
                        protein = remove_suffix(item.get('data-protein'))
                        fats = remove_suffix(item.get('data-total-fat'))
                        carbs = remove_suffix(item.get('data-total-carb'))
                        allergens = item.get('data-allergens')
                        meal_type = type.get('id')

                        # Write SQL query to insert a record into the database.
                        sql = f"INSERT INTO {DATABASE_MEAL_TABLE} (meal_name, date_served, calories, carbohydrates, fat, protein, allergens, dining_hall, meal_type, serving_size) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                        cursor.execute(sql, (food_name, formatted_date, calories, carbs, fats, protein, allergens, hall, meal_type, serving_size))

                    # Commit the changes after each dining hall
                    connection.commit()

                    # Re-find the drop-down after the page updates
                    date_dropdown = Select(driver.find_element(By.ID, 'upcoming-foodpro'))

finally:
    # Close the database connection
    connection.close()
    # Close the browser
    driver.stop_client() # ensures process fully closes
    driver.close()
    driver.quit()
