"""
bemyguest URL Configuration

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
from django.conf.urls import include, url, patterns
from django.contrib import admin
from bemyguest import settings
import core.views
import core.api

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$', core.views.user_login, name='login'),
    url(r'^logout/$', core.views.user_logout, name='logout'),
    url(r'^$', core.views.react_base, {'page': 'calendar'}, name='calendar'),
    url(r'^stats/$', core.views.react_base, {'page': 'stats'}, name='stats'),

    url(r'^api/user/$', core.api.user, name='api_user'),
    url(r'^api/login/$', core.api.user_login, name='api_login'),
    url(r'^api/reservations/$', core.api.reservations, name='api_reservations'),
    url(r'^api/reservations/(?P<pk>\d+)/$', core.api.reservation, name='api_reservation'),
    url(r'^api/feasts/$', core.api.feasts, name='api_feasts'),
    url(r'^api/meals/$', core.api.meals, name='api_meals'),

    url(r'^pdf/meals/$', core.views.pdf_meals, name='pdf_meals'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns('',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )
