from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException

import unittest

PAGE_ADDRESS = 'http://127.0.0.1:8000'


class GeneralTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)
    def tearDown(self):
        self.browser.quit()

    def test_website_works(self):
        # Test that the website is working
        response = self.browser.get( PAGE_ADDRESS )
        self.assertIn('Dummy page', self.browser.title)

        self.fail('Success: Finish the test_website_works successfully')



if __name__ == '__main__':
    unittest.main()
