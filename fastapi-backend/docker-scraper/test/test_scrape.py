import pytest
from unittest.mock import MagicMock, patch
from selenium.webdriver.support.ui import Select
from datetime import date
import sys
from pathlib import Path

# Add the project root directory to the path
root_dir = str(Path(__file__).resolve().parents[1])  
sys.path.append(root_dir)
import get_food

class TestUnit:
    # Test convert_date function
    def test_convert_date_valid(self):
        assert get_food.convert_date('Wed April 03, 2024') == date(2024, 4, 3)

    def test_convert_date_invalid(self):
        with pytest.raises(ValueError):
            get_food.convert_date('invalid-date-string')

    # Test remove_suffix function
    def test_remove_suffix_mg(self):
        assert get_food.remove_suffix('250mg') == 0.25

    def test_remove_suffix_g(self):
        assert get_food.remove_suffix('10g') == 10

    def test_remove_suffix_no_suffix(self):
        assert get_food.remove_suffix('100') == 100

    # Test safe_convert function
    def test_safe_convert_valid_float(self):
        assert get_food.safe_convert('100.5', float) == 100.5

    def test_safe_convert_invalid_float_default(self):
        assert get_food.safe_convert('abc', float, default=0) == 0


class TestMockIntegration:
    # Mocking parse_menu_data function
    @patch('get_food.webdriver.Chrome')
    @patch('get_food.BeautifulSoup')
    @patch('get_food.Select')
    def test_parse_menu_data(self, mock_select, mock_beautiful_soup, mock_chrome):
        driver = MagicMock()
        select_element = MagicMock()
        driver.find_element.return_value = select_element

        # Mock the page source
        driver.page_source = '''
        <html>
        <select id="upcoming-foodpro">
            <option value="2024-04-03">Wed April 03, 2024</option>
        </select>
        <div role="tabpanel" id="lunch">
            <a class="lightbox-nutrition" data-calories="250" data-serving-size="1 plate" data-protein="25g" data-total-fat="10g" data-total-carb="30g" data-allergens="nuts">Chicken Plate</a>
        </div>
        </html>
        '''

        # Setup Select mock to simulate correct interaction
        select_mock = MagicMock()
        select_mock.first_selected_option.text = 'Wed April 03, 2024'
        select_mock.options = [MagicMock(text='Wed April 03, 2024')]
        mock_select.return_value = select_mock

        soup = MagicMock()
        tabpanel_mock = MagicMock()
        link_mock = MagicMock()
        link_mock.text = "Chicken Plate"
        link_mock.get = MagicMock(side_effect=["250", "1 plate", "25g", "10g", "30g", "nuts"])

        tabpanel_mock.select.return_value = [link_mock]  # This represents finding the link elements under the tabpanel
        soup.select.return_value = [tabpanel_mock]  # Soup selects to get tabpanels
        mock_beautiful_soup.return_value = soup

        # Testing the function
        result = get_food.parse_menu_data(driver, "berkshire")
        assert len(result) == 1  # Check if one menu item is parsed
        assert result[0]['food_name'] == 'Chicken Plate'  # Verify parsed content
        assert result[0]['allergens'] == 'nuts'  # Verify parsed content


    # Testing setup_browser function
    @patch('get_food.ChromeDriverManager')
    @patch('get_food.webdriver.Chrome')
    def test_setup_browser(self, mock_chrome, mock_manager):
        manager_instance = mock_manager.return_value
        manager_instance.install.return_value = '/path/to/chromedriver'
        get_food.setup_browser()
        manager_instance.install.assert_called_once()
        mock_chrome.assert_called_once()


    # Testing setup_database function
    @patch('get_food.pymysql.connect')
    def test_setup_database(self, mock_connect):
        get_food.setup_database()
        mock_connect.assert_called_once()

    # Integration Test for main function
    @patch('get_food.setup_browser')
    @patch('get_food.setup_database')
    @patch('get_food.fetch_and_save_menus')
    def test_main(self, mock_fetch_and_save_menus, mock_setup_database, mock_setup_browser):
        get_food.main()
        mock_setup_browser.assert_called_once()
        mock_setup_database.assert_called_once()
        mock_fetch_and_save_menus.assert_called_once()

# Run pytest
if __name__ == '__main__':
    pytest.main()
