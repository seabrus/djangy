from django.db import models
from django.contrib.auth.models import User 


class Company(models.Model):
    manager = models.ForeignKey(User)
    company_name = models.CharField(max_length=50)
    founded_at =  models.CharField(max_length=4)
    email =  models.EmailField()
    logo_img = models.ImageField(upload_to='companies', blank=True, null=True)
    payment_method = models.CharField(max_length=50)
    subscription_plan = models.CharField(max_length=50)

    def __unicode__(self):
        return self.company_name


class OpeningHours(models.Model):
    DAY_CHOICES = ( 
        ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday'), ('Sunday', 'Sunday')
    ) 

    company = models.ForeignKey(Company, related_name='hours')     # related_name='hours' is required for CompanySerializer 
    day_name = models.CharField(choices=DAY_CHOICES, max_length=50)
    from_time = models.CharField(max_length=5)
    until_time = models.CharField(max_length=5)

    def __unicode__(self):
        return 'from ' + self.from_time + ', until ' + self.until_time






