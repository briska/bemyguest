import json
from django.views.decorators.csrf import csrf_exempt
from core.models import Reservation
from core.serializers import serialize_reservation, serialize_user
from django.http.response import JsonResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login


@csrf_exempt
def user(request):
    if request.user.is_anonymous():
        return JsonResponse({'error': 'loggedOut'})
    user = serialize_user(request.user)
    return JsonResponse({'user': user})


@csrf_exempt
def user_login(request):
    form = AuthenticationForm(request, data=json.loads(request.body))
    if form.is_valid():
        login(request, form.get_user())
        user = serialize_user(request.user)
        return JsonResponse({'user': user})
    return JsonResponse({'error': 'wrongCredentials'})


@csrf_exempt
def reservations(request):
    if request.user.is_anonymous():
        return JsonResponse({'error': 'loggedOut'})
    reservations = [serialize_reservation(reservation) for reservation in Reservation.objects.all()]
    return JsonResponse({'reservations': reservations})

