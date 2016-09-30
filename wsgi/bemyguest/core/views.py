from django.shortcuts import render, redirect
from core.models import Room, House, Meal
from core.serializers import serialize_house, serialize_room
from django.contrib.auth.forms import AuthenticationForm
from django.views.decorators.debug import sensitive_post_parameters
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import never_cache
from django.core.urlresolvers import reverse
from django.contrib.auth import login, logout
from django.contrib.messages.api import add_message
from django.contrib.messages.constants import INFO, ERROR
from django.utils.translation import ugettext_lazy as _
from django.db.models.query import Prefetch
import json
from bemyguest import settings
from core.utils import render_to_pdf
from django.http.response import HttpResponseBadRequest

# Create your views here.

STATIC_VERSION = 1

def react_base(request, page):
    if not request.user.is_authenticated():
        data = {
            'login_form': AuthenticationForm(request)
        }
        return render(request, 'login.html', data)
    houses = []
    rooms = []
    for house in House.objects.all().prefetch_related(Prefetch('rooms', queryset=Room.objects.all())):
        houses.append(serialize_house(house))
        for room in house.rooms.all():
            rooms.append(serialize_room(room))
    request_data = {
        'houses': houses,
        'rooms': rooms,
    }
    data = {
        'page': page,
        'request_data': json.dumps(request_data),
        'static_version': STATIC_VERSION,
        'is_debug' : settings.DEBUG,
    }
    return render(request, 'react_base.html', data)


@sensitive_post_parameters()
@csrf_exempt
@never_cache
def user_login(request):
    if request.method == 'POST':
        redirect_url = request.POST.get('next', reverse('calendar'))
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect(redirect_url)
        else:
            add_message(request, ERROR, _('WRONG_USERNAME_OR_PASSWORD'))
            data = {
                'login_form': AuthenticationForm(request)
            }
            return render(request, 'login.html', data)
    return redirect(reverse('calendar'))


def user_logout(request):
    redirect_url = request.GET.get('next', reverse('calendar'))
    logout(request)
    add_message(request, INFO, _('LOGGED_OUT'))
    return redirect(redirect_url)

@csrf_exempt
def pdf_meals(request):
    if request.user.is_anonymous():
        return HttpResponseBadRequest("loggedOut")

    if request.method == 'GET':
        date_from = request.GET.get('date_from', None)
        date_to = request.GET.get('date_to', None)
        if not date_from or not date_to:
            return HttpResponseBadRequest("bad request: missing date_from or date_to")
        meals = Meal.get_meals_sum(date_from, date_to)
        return render_to_pdf(
                'pdf/pdf_meals.html',
                'strava_' + str(date_from) + '_' + str(date_to),
                {
                    'pagesize': 'A4',
                    'title': 'beMyGuest v Sampore | Strava | ' + str(date_from) + '_' + str(date_to),
                    'mylist': meals,
                }
            )
