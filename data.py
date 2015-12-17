from django.contrib.auth.models import User 
from django.conf import settings
from django.core.files import File

from da.models import Company, OpeningHours

def create_data():
    manager = User.objects.get( username='seanBr' )

    company_name = 'Cordova'
    founded_at = '1977'
    email = 'cordova@gmail.com'
    payment_method = 'Bank transfer'
    subscription_plan = 'Business plan'

    f = open(settings.MEDIA_ROOT + 'test/logo2.jpg')
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

#'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
def create_hours():
    company = Company.objects.get( company_name = 'Cordova' )
    day_name = 'Monday'
    from_time = '10:00'
    until_time = '20:00'
    OpeningHours.objects.create(
        company = company,
        day_name = day_name,
        from_time = from_time,
        until_time = until_time,
    )

    day_name = 'Tuesday'
    from_time = '7:00'
    until_time = '12:15'
    OpeningHours.objects.create(
        company = company,
        day_name = day_name,
        from_time = from_time,
        until_time = until_time,
    )

    day_name = 'Tuesday'
    from_time = '14:00'
    until_time = '17:00'
    OpeningHours.objects.create(
        company = company,
        day_name = day_name,
        from_time = from_time,
        until_time = until_time,
    )

    day_name = 'Tuesday'
    from_time = '18:00'
    until_time = '22:15'
    OpeningHours.objects.create(
        company = company,
        day_name = day_name,
        from_time = from_time,
        until_time = until_time,
    )

    return 


if __name__ == '__main__':
    create_data()
    create_hours()
