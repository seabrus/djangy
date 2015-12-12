from django.conf.urls import include, url
from django.views.generic import TemplateView, RedirectView
from django.contrib.auth.decorators import login_required, permission_required


urlpatterns = [

    #url(r'^profile/$', login_required(TemplateView.as_view(template_name='da/ang/profile.html'), login_url='/accounts/login/'), name='da_profile'),
    url(r'^$', TemplateView.as_view(template_name='da/base.html'), name='da_base'),

]
