from django.shortcuts import render, redirect
from core.models import Room, House
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

# Create your views here.

STATIC_VERSION = 1

def react_base(request, page):
    if not request.user.is_authenticated():
        data = {
            'login_form': AuthenticationForm(request)
        }
        return render(request, 'login.html', data)
    houses = {}
    rooms = {}
    for house in House.objects.all().prefetch_related(Prefetch('rooms', queryset=Room.objects.all().order_by('name'))):
        houses[house.id] = serialize_house(house)
        for room in house.rooms.all():
            rooms[room.id] = serialize_room(room)
    context = {
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'mail': request.user.email,
        },
        'houses': houses,
        'rooms': rooms,
    }
    data = {
        'page': page,
        'context': json.dumps(context),
        'static_version': STATIC_VERSION,
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
        else:
            add_message(request, ERROR, _('WRONG_USERNAME_OR_PASSWORD'))
        return redirect(redirect_url)
    return redirect(reverse('calendar'))


def user_logout(request):
    redirect_url = request.GET.get('next', reverse('calendar'))
    logout(request)
    add_message(request, INFO, _('LOGGED_OUT'))
    return redirect(redirect_url)
