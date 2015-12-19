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



import json

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, MultiPartParser

NEW_COMPANY = 'NEW COMPANY'


class CompanyProfile(APIView):
    permission_classes = (permissions.IsAuthenticated, IsManager, )
    parser_classes = (JSONParser, MultiPartParser, )

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


    def post(self, request, format=None):
        company = self.get_company(request)

        if request.data.get('json_data'):
            data = request.data.get('json_data')
            #data = JSONParser().parse(json_data)
            data = json.loads( data )
        else:
            data = request.data

        logo_img_file = request.data.get('logo_img', None)
        if logo_img_file:
            data.update( {'logo_img': logo_img_file} )
            if bool( company.logo_img ):
                company.logo_img.delete(save=False)

        if company == NEW_COMPANY:
            serializer = CompanySerializer(data=data)
        else:
            serializer = CompanySerializer(company, data=data)
        if serializer.is_valid():
            serializer.save(manager=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    """
    def post(self, request, format=None):
        company = self.get_company(request)
        if company == NEW_COMPANY:
            serializer = CompanySerializer(data=request.data)
        else:
            serializer = CompanySerializer(company, data=request.data)
        if serializer.is_valid():
            serializer.save(manager=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    """

    def delete(self, request, format=None):
        company = self.get_company(request)
        if company != NEW_COMPANY:
            if bool( company.logo_img ):
                company.logo_img.delete(save=False)
            company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)







