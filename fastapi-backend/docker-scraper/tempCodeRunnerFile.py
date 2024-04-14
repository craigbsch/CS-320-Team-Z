# Select all items with the 'lightbox-nutrition' class
                food_items = soup.select('.lightbox-nutrition a')
                print(food_items)
                selected_date = date_dropdown.first_selected_option.text.strip()
                formatted_date = convert_date(selected_date)

                for item in food_items:

                    # Select all items with the 'lightbox-nutrition' class

                    food_name = item.text.strip()
                    calories = safe_convert(item.get('data-calories'), int)
                    protein = safe_convert(remove_suffix(item.get('data-protein')), float)
                    fats = safe_convert(remove_suffix(item.get('data-total-fat')), float)
                    carbs = safe_convert(remove_suffix(item.get('data-total-carb')), float)
                    allergens = item.get('data-allergens')
                    meal_type = type.get('id')


                    # Write SQL query to insert a record into the database.
                    sql = f"INSERT INTO {DATABASE_MEAL_TABLE} (meal_name, date_served, calories, carbohydrates, fat, protein, allergens, dining_hall, meal_type) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                    cursor.execute(sql, (food_name, formatted_date, calories, carbs, fats, protein, allergens, hall, meal_type))

                # Commit the changes after each dining hall
                connection.commit()

                # Re-find the drop-down after the page updates
                date_dropdown = Select(driver.find_element(By.ID, 'upcoming-foodpro'))