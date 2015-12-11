from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException

import time
import unittest

PAGE_ADDRESS = 'http://127.0.0.1:8000'
PASSWORD = ' '


class GeneralTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(2)
    def tearDown(self):
        self.browser.quit()
    """
    def test_website_works(self):
        # Test that the website is working in principle
        self.browser.get( PAGE_ADDRESS )
        self.assertIn('Dummy page', self.browser.title)

        self.fail('Success:  test_website_works')
    """

    def test_google_login_works(self):
        # Test that the google_login is working corrctly
        self.browser.get( 'https://accounts.google.com/ServiceLogin?service=mail&continue=https://mail.google.com/mail/#identifier' )

        inputbox_email = self.browser.find_element_by_id('Email')
        inputbox_email.send_keys('seabrus')
        inputbox_email.send_keys(Keys.ENTER)
        time.sleep(2)

        inputbox_Passwd = self.browser.find_element_by_id('Passwd')
        inputbox_Passwd.send_keys( PASSWORD )
        inputbox_Passwd.send_keys(Keys.ENTER)
        time.sleep(2)

        self.browser.get( PAGE_ADDRESS )

        # http://stackoverflow.com/questions/17676036/python-webdriver-to-handle-pop-up-browser-windows-which-is-not-an-alert
        main_window_handle = None
        while not main_window_handle:
            main_window_handle = self.browser.current_window_handle

        self.browser.find_element_by_id('google_login_menu_item').click()
        time.sleep(5)

        signin_window_handle = None
        while not signin_window_handle:
            for handle in self.browser.window_handles:
                if handle != main_window_handle:
                    signin_window_handle = handle
                    break
        self.browser.switch_to.window(signin_window_handle)
        self.browser.find_element_by_id('submit_approve_access').click()
        self.browser.switch_to.window(main_window_handle)
        time.sleep(5)

        #with self.assertRaises( NoSuchElementException ):
        #     google_logout_menu_item = self.browser.find_element_by_link_text('Log Out')
        self.assertIn('Log Out', self.browser.page_source)
        self.assertIn('sean:', self.browser.page_source)

        self.fail('Success:  test_google_login_works')


if __name__ == '__main__':
    unittest.main()
