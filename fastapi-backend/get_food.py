from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from webdriver_manager.chrome import ChromeDriverManager
import csv

# Setup Chrome with Selenium WebDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

dining_halls = ['berkshire', 'worcester', 'franklin', 'hampshire']

# Open a CSV file to write the data
with open('menu_nutritional_info.csv', mode='w', newline='') as file:
    writer = csv.writer(file)

    writer.writerow(['Date', 'Food Item', 'Calories', 'Protein (g)', 'Fats (g)', 'Allergens', 'Dining Hall'])

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
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, '.lightbox-nutrition a')))

            # Now you can interact with the page, scrape content, click buttons, etc.
            content = driver.page_source

            # Parse the HTML content of the page
            soup = BeautifulSoup(content, 'html.parser')

            # Select all items with the 'lightbox-nutrition' class
            food_items = soup.select('.lightbox-nutrition a')
            selected_date = date_dropdown.first_selected_option.text.strip()  # Get the selected date text

            for item in food_items:

                # Select all items with the 'lightbox-nutrition' class

                food_name = item.text.strip()
                calories = item.get('data-calories')
                protein = item.get('data-protein')
                fats = item.get('data-total-fat')
                allergens = item.get('data-allergens')

                # Write the extracted information to the CSV file
                writer.writerow([selected_date, food_name, calories, protein, fats, allergens, hall])

            # Re-find the drop-down after the page updates
            date_dropdown = Select(driver.find_element(By.ID, 'upcoming-foodpro'))

# Close the browser
driver.quit()
