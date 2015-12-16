from django.test import TestCase

class InitialTest(TestCase):
    def test_index(self):
        response = self.client.get('/') 
        self.assertEqual(response.status_code, 200)
        self.fail('Success: Finish  test_index  successfully')



from django.contrib.auth.models import User 
from django.conf import settings
from django.core.files import File

from . models import Company, OpeningHours

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




