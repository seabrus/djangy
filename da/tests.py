from django.test import TestCase

class InitialTest(TestCase):
    def test_index(self):
        response = self.client.get('/') 
        self.assertEqual(response.status_code, 200)
        self.fail('Success: Finish  test_index  successfully')



from django.contrib.auth.models import User 
from django.conf import settings
from django.core.files import File
from django.core.urlresolvers import reverse

from . models import Company, OpeningHours
from . views import CompanyList, HoursList

# ====================================================================
#   Auxiliary functions
# ====================================================================
def create_user():
    User.objects.create_user('test11', 'test11@test11.com', 'test11')
    return

def create_company():
    manager = User.objects.get( username='test11' )
    company_name = 'ABCDE'
    founded_at = '2011'
    email = 'abcde@cc.com'
    payment_method = 'PayPal'
    subscription_plan = 'Advanced plan'

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
        self.assertContains(response, 'ABCDE')
        self.fail('Success 2:  test_response_has_correct_json  is passed')

    def test_response_has_correct_html(self):
        response = self.client.get('/companies/')
        #print response
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'company_name')
        self.assertContains(response, 'ABCDE')
        self.fail('Success 3:  test_response_has_correct_html  is passed')


















