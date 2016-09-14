import json
import dateutil.parser, dateutil.tz
from django.views.decorators.csrf import csrf_exempt
from core.models import Reservation, RoomReservation, Guest, Meal, Feast
from core.serializers import serialize_reservation, serialize_user, \
    serialize_feast
from django.http.response import JsonResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login
from core.utils import convert_dict_keys_deep


@csrf_exempt
def user(request):
    if request.user.is_anonymous():
        return JsonResponse({'error': 'loggedOut'})
    user = serialize_user(request.user)
    return JsonResponse({'user': user})


@csrf_exempt
def user_login(request):
    if request.method == 'POST':
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
    if request.method == 'POST':
        reservation_data = convert_dict_keys_deep(json.loads(request.body))
        reservation = Reservation(
            name=reservation_data['name'],
            guests_count=reservation_data['guests_count'],
            contact_name=reservation_data['contact_name'],
            contact_mail=reservation_data['contact_mail'],
            contact_phone=reservation_data['contact_phone'],
            purpose=reservation_data['purpose'],
            spiritual_guide=reservation_data['spiritual_guide'],
            price_housing=reservation_data['price_housing'],
            price_spiritual=reservation_data['price_spiritual'],
            notes=reservation_data['notes'],
            mail_communication=reservation_data['mail_communication'],
        )
        reservation.save()
        for room_reservation_data in reservation_data['room_reservations']:
            room_reservation = RoomReservation(
                room_id=room_reservation_data['room_id'],
                reservation=reservation,
                date_from=room_reservation_data['date_from'],
                date_to=room_reservation_data['date_to'],
            )
            room_reservation.save()
            for guest_data in room_reservation_data['guests']:
                guest = Guest(
                    name_prefix=guest_data['name_prefix'],
                    name=guest_data['name'],
                    surname=guest_data['surname'],
                    name_suffix=guest_data['name_suffix'],
                    address_street=guest_data['address_street'],
                    address_number=guest_data['address_number'],
                    address_city=guest_data['address_city'],
                    phone=guest_data['phone'],
                )
                guest.save()
                room_reservation.guests.add(guest)
        for meal_data in reservation_data['meals']:
            meal = Meal(
                reservation=reservation,
                date=dateutil.parser.parse(meal_data['date']).astimezone(dateutil.tz.tzlocal()).date(),
            )
            meal.set_counts(meal_data['counts'])
            meal.save()
        return JsonResponse({'reservation': serialize_reservation(reservation)})
    reservations = [serialize_reservation(reservation) for reservation in Reservation.objects.all().prefetch_related('room_reservations__guests', 'meals')]
    return JsonResponse({'reservations': reservations})


@csrf_exempt
def reservation(request, pk):
    if request.user.is_anonymous():
        return JsonResponse({'error': 'loggedOut'})
    reservation = Reservation.objects.get(id=pk)
    if request.method == 'DELETE':
        reservation.delete()
        return JsonResponse({})
    if request.method == 'POST':
        reservation_data = convert_dict_keys_deep(json.loads(request.body))
        if 'room_reservation_remove' in reservation_data:
            room_reservation = reservation.room_reservations.get(id=reservation_data['room_reservation_remove'])
            room_reservation.delete()
        elif 'room_reservation' in reservation_data:
            room_reservation_data = reservation_data['room_reservation']
            room_reservation = reservation.room_reservations.get(id=room_reservation_data['id'])
            room_reservation.room_id = room_reservation_data['room_id']
            if room_reservation.date_from != room_reservation_data['date_from'] or room_reservation.date_to != room_reservation_data['date_to']:
                reservation.meals.all().delete()
            room_reservation.date_from = room_reservation_data['date_from']
            room_reservation.date_to = room_reservation_data['date_to']
            room_reservation.save()
            if 'prices' in reservation_data:
                reservation.price_housing = reservation_data['prices']['price_housing']
                reservation.price_spiritual = reservation_data['prices']['price_spiritual']
                reservation.save()
            for guest_data in room_reservation_data['guests']:
                if guest_data['id']:
                    guest = room_reservation.guests.get(id=guest_data['id'])
                    guest.name_prefix = guest_data['name_prefix']
                    guest.name = guest_data['name']
                    guest.surname = guest_data['surname']
                    guest.name_suffix = guest_data['name_suffix']
                    guest.address_street = guest_data['address_street']
                    guest.address_number = guest_data['address_number']
                    guest.address_city = guest_data['address_city']
                    guest.phone = guest_data['phone']
                    guest.save()
                else:
                    guest = Guest(
                        name_prefix=guest_data['name_prefix'],
                        name=guest_data['name'],
                        surname=guest_data['surname'],
                        name_suffix=guest_data['name_suffix'],
                        address_street=guest_data['address_street'],
                        address_number=guest_data['address_number'],
                        address_city=guest_data['address_city'],
                        phone=guest_data['phone'],
                    )
                    guest.save()
                    room_reservation.guests.add(guest)
        elif 'meals' in reservation_data:
            reservation.meals.all().delete()
            for meal_data in reservation_data['meals']:
                meal = Meal(
                    reservation=reservation,
                    date=dateutil.parser.parse(meal_data['date']).astimezone(dateutil.tz.tzlocal()).date(),
                )
                meal.set_counts(meal_data['counts'])
                meal.save()
        elif 'overall_date' in reservation_data:
            overall_date_data = reservation_data['overall_date']

            for room_reservation in reservation.room_reservations.all():
                room_reservation.date_from = overall_date_data['date_from']
                room_reservation.date_to = overall_date_data['date_to']
                room_reservation.save()
        else:
            if 'name' in reservation_data:
                reservation.name = reservation_data['name']
            elif 'guests_count' in reservation_data:
                reservation.guests_count = reservation_data['guests_count']
            elif 'purpose' in reservation_data:
                reservation.purpose = reservation_data['purpose']
            elif 'spiritual_guide' in reservation_data:
                reservation.spiritual_guide = reservation_data['spiritual_guide']
            elif 'contact' in reservation_data:
                reservation.contact_name = reservation_data['contact']['contact_name']
                reservation.contact_mail = reservation_data['contact']['contact_mail']
                reservation.contact_phone = reservation_data['contact']['contact_phone']
            elif 'notes' in reservation_data:
                reservation.notes = reservation_data['notes']
            elif 'mail_communication' in reservation_data:
                reservation.mail_communication = reservation_data['mail_communication']
            elif 'price_payed' in reservation_data:
                reservation.price_payed = reservation_data['price_payed']
            elif 'approved' in reservation_data:
                reservation.approved = True
            reservation.save()
    return JsonResponse({'reservation': serialize_reservation(reservation)})


def feasts(request):
    if request.user.is_anonymous():
        return JsonResponse({'error': 'loggedOut'})
    feasts = [serialize_feast(feast) for feast in Feast.objects.all()]
    return JsonResponse({'feasts': feasts})
