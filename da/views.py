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


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import status

NEW_COMPANY = 'NEW COMPANY'


class CompanyProfile(APIView):
    permission_classes = (permissions.IsAuthenticated, IsManager, )

    def get_company(self, request):
        try:
            return Company.objects.get(manager=request.user)
        except Company.DoesNotExist:
            return NEW_COMPANY

    def get(self, request, format=None):
        company = self.get_company(request)
        if company == NEW_COMPANY:
            return Response( {'is_new': True} )
        serializer = CompanySerializer(company)
        return Response(serializer.data)









