from bs4 import BeautifulSoup
import requests
import csv

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Setup Chrome with Selenium WebDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

dining_halls = ['berkshire', 'worcester', 'franklin', 'hampshire']

# Open a CSV file to write the data
with open('menu_nutritional_info.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Food Item', 'Calories', 'Protein (g)', 'Fats (g)', 'Dining Hall'])

    for hall in dining_halls:

        # Open a webpage
        driver.get(f"https://umassdining.com/locations-menus/{hall}/menu")

        # Wait for the page to load and JavaScript to execute
        # You can adjust the time as needed
        driver.implicitly_wait(15)

        # Now you can interact with the page, scrape content, click buttons, etc.
        content = driver.page_source

        # Parse the HTML content of the page
        soup = BeautifulSoup(content, 'html.parser')

        # Select all items with the 'lightbox-nutrition' class
        food_items = soup.select('.lightbox-nutrition a')

        for item in food_items:
            # Get the food item name and nutritional info from data attributes
            food_name = item.text.strip()
            calories = item.get('data-calories')
            protein = item.get('data-protein')
            fats = item.get('data-total-fat')

            # Write the extracted information to the CSV file
            writer.writerow([food_name, calories, protein, fats, hall])

# Close the browser
driver.quit()
