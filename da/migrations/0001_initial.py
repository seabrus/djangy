# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('company_name', models.CharField(max_length=50)),
                ('founded_at', models.CharField(max_length=4)),
                ('email', models.EmailField(max_length=254)),
                ('logo_img', models.ImageField(null=True, upload_to=b'companies', blank=True)),
                ('payment_method', models.CharField(max_length=50)),
                ('subscription_plan', models.CharField(max_length=50)),
                ('manager', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OpeningHours',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('day_name', models.CharField(max_length=50, choices=[(b'Monday', b'Monday'), (b'Tuesday', b'Tuesday'), (b'Wednesday', b'Wednesday'), (b'Thursday', b'Thursday'), (b'Friday', b'Friday'), (b'Saturday', b'Saturday'), (b'Sunday', b'Sunday')])),
                ('from_time', models.CharField(max_length=5)),
                ('until_time', models.CharField(max_length=5)),
                ('company', models.ForeignKey(to='da.Company')),
            ],
        ),
    ]
