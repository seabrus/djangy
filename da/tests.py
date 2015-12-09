from django.test import TestCase


class InitialTest(TestCase):

    def test_index(self):
        response = self.client.get('/') 
        self.assertEqual(response.status_code, 200)
        self.fail('Success: Finish the test_index successfully')
