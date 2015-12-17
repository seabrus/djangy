"""
   'django-rest-auth' views
"""
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter



"""
   other views
"""
from django.shortcuts import render

from rest_framework import generics
from rest_framework import permissions

from . models import Company, OpeningHours
from . serializers import CompanySerializer, OpeningHoursSerializer
from . permissions import IsManager


class CompanyList(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class HoursList(generics.ListAPIView):
    queryset = OpeningHours.objects.all()
    serializer_class = OpeningHoursSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
















