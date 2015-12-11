from django.conf.urls import include, url
from django.views.generic import TemplateView, RedirectView


urlpatterns = [

    url(r'^$', TemplateView.as_view(template_name='da/base.html'), name='da_base'),

]
