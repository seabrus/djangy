from django.test import TestCase

class InitialTest(TestCase):
    def test_home_is_present(self):
        response = self.client.get('/') 
        self.assertEqual(response.status_code, 200)
        self.fail('Success:  test_home_is_present  is passed')



from django.contrib.auth.models import User 
from django.conf import settings
from django.core.files import File
from django.core.urlresolvers import reverse

from . models import Company, OpeningHours
from . views import CompanyList, HoursList, CompanyProfile

# ====================================================================
#   Auxiliary functions
# ====================================================================
def create_user():
    User.objects.create_user('test11', 'test11@test11.com', 'test11')
    return

def create_company():
    manager = User.objects.get( username='test11' )
    company_name = 'ABC 000'
    founded_at = '2012'
    email = 'abc-00@ccg.com'
    payment_method = 'PayPal'
    subscription_plan = 'Business plan'

    f = open(settings.MEDIA_ROOT + 'test/ppp.png')
    logo_img = File( f )

    Company.objects.create(
        manager = manager,
        company_name = company_name,
        founded_at = founded_at,
        email = email,
        logo_img = logo_img,
        payment_method = payment_method,
        subscription_plan = subscription_plan,
    )

    logo_img.close()
    return

def create_hours():
    company = Company.objects.get( pk=1 )

    day_name = 'Monday'
    from_time = '11:00'
    until_time = '19:45'
    OpeningHours.objects.create(
        company = company,
        day_name = day_name,
        from_time = from_time,
        until_time = until_time,
    )

    day_name = 'Sunday'
    from_time = '12:20'
    until_time = '22:00'
    OpeningHours.objects.create(
        company = company,
        day_name = day_name,
        from_time = from_time,
        until_time = until_time,
    )

    day_name = 'Friday'
    from_time = '9:00'
    until_time = '23:55'
    OpeningHours.objects.create(
        company = company,
        day_name = day_name,
        from_time = from_time,
        until_time = until_time,
    )

    return 


# ====================================================================
#   Tests
# ====================================================================

#DB tests
class DbTest(TestCase):
    def test_models_creation(self):
        create_user()
        create_company()
        create_hours()

        logo_image = Company.objects.all()[0].logo_img
        #print 'name =', logo_image.name, ' url =', logo_image.url
        self.assertIn('ppp.png', logo_image.name)
        self.assertEqual('/media/companies/ppp.png', logo_image.url)
        logo_image.delete()

        company = Company.objects.get(pk=1)
        self.assertEqual( len(company.openinghours_set.all()), 3 )
        #print 'Opening hours =', len(company.openinghours_set.all())

        self.fail('Success: Finish  test_models_creation  successfully')


# '/companies/' view and json tests -- 'da:company_list'
class CompaniesAPITest(TestCase):
    #fixtures = ['mammals.json', 'birds']

    @classmethod   # https://docs.djangoproject.com/en/1.8/topics/testing/tools/#django.test.TestCase.setUpTestData, new from v. 1.8
    def setUpTestData(cls):
        create_user()
        create_company()
        create_hours()

    @classmethod
    def tearDownClass(cls):
        logo_image = Company.objects.all()[0].logo_img
        logo_image.delete()
        super(CompaniesAPITest, cls).tearDownClass()   # Call parent last


    def test_url_resolves_to_correct_view(self):
        response = self.client.get(reverse('da:company_list'))
        self.assertEqual(response.resolver_match.func.__name__, CompanyList.as_view().__name__)
        self.fail('Success 1:  test_url_resolves_to_correct_view  is passed')

    def test_response_has_correct_json(self):
        response = self.client.get('/companies/?format=json')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'founded_at')
        self.assertContains(response, 'ABC 000')
        self.fail('Success 2:  test_response_has_correct_json  is passed')

    def test_response_has_correct_html(self):
        response = self.client.get('/companies/')
        #print response
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'company_name')
        self.assertContains(response, 'ABC 000')
        self.fail('Success 3:  test_response_has_correct_html  is passed')



import json
from urlparse import urlparse

from rest_framework.test import APIRequestFactory
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.test import APITestCase

# '/company-profile/' view and json tests -- 'da:company_profile'
class CompanyProfileAPITest( APITestCase ):
    #fixtures = ['mammals.json', 'birds']

    @classmethod
    def setUpTestData(cls):
        create_user()
        create_company()
        create_hours()

    @classmethod
    def tearDownClass(cls):
        logo_image = Company.objects.all()[0].logo_img
        logo_image.delete()
        super(CompanyProfileAPITest, cls).tearDownClass()   # Call parent last


    def test_url_resolves_to_correct_profile_view(self):
        response = self.client.get(reverse('da:company_profile'))
        self.assertEqual(response.resolver_match.func.__name__, CompanyProfile.as_view().__name__)
        self.fail('Success 1:  test_url_resolves_to_correct_profile_view  is passed')

    def test_response_has_correct_profile_json(self):
        #user = User.objects.get(username='test11')
        #self.client.force_authenticate(user=user)     # this doesn't work ?
        self.client.login(username='test11', password='test11')
        response = self.client.get('/company-profile/?format=json')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'founded_at')
        self.assertContains(response, 'ABC 000')
        self.client.logout()
        self.fail('Success 2:  test_response_has_correct_profile_json  is passed')

    def test_response_has_correct_profile_html(self):
        self.client.login(username='test11', password='test11')
        response = self.client.get('/company-profile/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'company_name')
        self.assertContains(response, 'ABC 000')
        self.client.logout()
        self.fail('Success 3:  test_response_has_correct_profile_html  is passed')


    def test_post_json_request(self):
        """
            Test post request with changing the number of hours time spans
            No logo file
        """
        company = Company.objects.get( pk=1 )
        self.assertEqual(company.hours.count(), 3)     # Initial hours

        self.client.login(username='test11', password='test11')
        url = reverse('da:company_profile')
        data = {
            'company_name': 'May 15',
            'founded_at': '2014',
            'email': 'cc@ggg.com',
            'payment_method': 'PayPal',
            'subscription_plan': 'Business Plan',
            'logo_url': '',
            'hours': [],     # with this it should be  company.hours.count() == 0  is True
        }
        response = self.client.post(url, data, format='json')

        company = Company.objects.get( pk=1 )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual( company.hours.count(), 0)
        self.assertEqual( Company.objects.get().company_name, 'May 15')

        self.client.logout()
        self.fail('Success 4:  test_post_json_request  is passed')


    def test_post_multipart_request(self):
        """
            Test post request with a new logo file
            See also https://medium.com/@jxstanford/django-rest-framework-file-upload-e4bc8de669c0#.cna57jf6d
        """
        self.client.login(username='test11', password='test11')

        url = reverse('da:company_profile')
        json_data = {
            'company_name': 'May 15',
            'founded_at': '2014',
            'email': 'cc@ggg.com',
            'payment_method': 'PayPal',
            'subscription_plan': 'Business Plan',
            'logo_url': '',
            'hours': [],

        }
        json_data = json.dumps( json_data )

        f = open(settings.MEDIA_ROOT + 'test/qqq.png')

        data = {
            'json_data': json_data,
            'logo_img': f,
        }

        response = self.client.post(url, data, format='multipart')

        company = Company.objects.get( pk=1 )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(company.logo_img.name, 'companies/qqq.png')
        self.assertTrue( urlparse(response.data['logo_img']).path.startswith(settings.MEDIA_URL) )

        f.close()
        company.logo_img.delete()
        self.client.logout()
        self.fail('Success 5:  test_post_multipart_request  is passed')


    def test_post_request_for_unauthenticated_user(self):
        # assert an unauthenticated user cannot access /company-profile/
        url = reverse('da:company_profile')
        data = {
            'company_name': 'May 15',
            'founded_at': '2014',
            'email': 'cc@ggg.com',
            'payment_method': 'PayPal',
            'subscription_plan': 'Business Plan',
            'logo_url': '',
            'hours': [],
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        self.fail('Success 6:  test_post_request_for_unauthenticated_user  is passed')













