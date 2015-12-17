from django.conf.urls import include, url
from django.views.generic import TemplateView, RedirectView
from django.contrib.auth.decorators import login_required, permission_required

from rest_framework.urlpatterns import format_suffix_patterns

from . views import CompanyList, HoursList

urlpatterns = [

    #url(r'^profile/$', login_required(TemplateView.as_view(template_name='da/ang/profile.html'), login_url='/accounts/login/'), name='da_profile'),
    url(r'^companies/$', CompanyList.as_view(), name='company_list'),
    url(r'^hours/$', HoursList.as_view(), name='hours_list'),
    url(r'^$', TemplateView.as_view(template_name='da/base.html'), name='da_base'),

]

urlpatterns = format_suffix_patterns(urlpatterns)
