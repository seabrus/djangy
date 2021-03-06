"""djangy_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView, RedirectView

from da.views import GoogleLogin


urlpatterns = [
    url(r'^', include('da.urls', namespace='da')),

    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/google/$', GoogleLogin.as_view(), name='ggl_login'),
    url(r'^rest-auth/google/callback/$', TemplateView.as_view(template_name='da/ggl-callback.html'), name='ggl_callback'),
        # http://127.0.0.1:8000/rest-auth/google/callback/ - Authorized redirect URIs

    url(r'^accounts/', include('allauth.urls')),
        # http://127.0.0.1:8000/accounts/google/login/callback/ - Authorized redirect URIs
    #url(r'^accounts/profile/$', RedirectView.as_view(url='/', permanent=True), name='profile-redirect'),

    url(r'^admin/', include(admin.site.urls)),

]

"""
     This is not suitable for production use! 
     https://docs.djangoproject.com/en/1.8/howto/static-files/#serving-uploaded-files-in-development
"""
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static( settings.MEDIA_URL, document_root=settings.MEDIA_ROOT )



