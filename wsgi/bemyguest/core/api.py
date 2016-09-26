import json
from django.views.decorators.csrf import csrf_exempt
from core.models import Reservation, RoomReservation, Guest, Meal, Feast
from core.serializers import serialize_reservation, serialize_user, serialize_feast
from django.http.response import JsonResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login
from django.db.models import Q, F
from core.utils import convert_dict_keys_deep, to_datetime
from collections import defaultdict

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
                if (guest_data['name'] and guest_data['surname']):
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
                date=meal_data['date'],
            )
            meal.set_counts(meal_data['counts'])
            meal.save()

        reservation.update_prices()

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

            if 'room_id' in room_reservation_data:
                room_reservation.room_id = room_reservation_data['room_id']

            if 'date_from' in room_reservation_data or 'date_to' in room_reservation_data:
                first_day = reservation.get_date_from()
                last_day = reservation.get_date_to()

                if 'date_from' in room_reservation_data:
                    room_reservation.date_from = room_reservation_data['date_from']

                if 'date_to' in room_reservation_data:
                    room_reservation.date_to = room_reservation_data['date_to']

            room_reservation.save()

            if 'date_from' in room_reservation_data or 'date_to' in room_reservation_data:
                new_first_day = reservation.get_date_from()
                new_last_day = reservation.get_date_to()

                is_from_different = first_day.date() != new_first_day.date()
                is_to_different = last_day.date() != new_last_day.date()

                if is_from_different or is_to_different:
                    # reservation was moved
                    if (last_day - first_day).days == (new_last_day - new_first_day).days:
                        reservation.meals.all().update(date=F('date') + (new_last_day - last_day).days)
                    else:
                        reservation.meals.filter(~Q(date__range=(new_first_day, new_last_day))).delete()

                    reservation.update_prices()

            if 'guests' in room_reservation_data:
                for guest_data in room_reservation_data['guests']:
                    if guest_data['id']:
                        guest = room_reservation.guests.get(id=guest_data['id'])
                        if (not guest_data['name'] or not guest_data['surname']):
                            guest.delete()
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
                        if (guest_data['name'] and guest_data['surname']):
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
                    date=meal_data['date'],
                )
                meal.set_counts(meal_data['counts'])
                meal.save()

        elif 'overall_date' in reservation_data:
            first_day = reservation.get_date_from()
            last_day = reservation.get_date_to()
            date_from = to_datetime(reservation_data['overall_date']['date_from'])
            date_to = to_datetime(reservation_data['overall_date']['date_to'])
            is_from_different = first_day.date() != date_from.date()
            is_to_different = last_day.date() != date_to.date()
            if is_from_different or is_to_different:
                # reservation was moved
                if (last_day - first_day).days == (date_to - date_from).days:
                    reservation.meals.all().update(date=F('date') + (date_to - last_day).days)
                else:
                    reservation.meals.filter(~Q(date__range=(date_from, date_to))).delete()
            for room_reservation in reservation.room_reservations.all():
                room_reservation.date_from = date_from
                room_reservation.date_to = date_to
                room_reservation.save()

            reservation.update_prices()

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

def meals(request):
    if request.user.is_anonymous():
        return JsonResponse({'error': 'loggedOut'})

    mealsSum = defaultdict(list)
    if request.method == 'GET':
        date_from = request.GET['date_from']
        date_to = request.GET['date_to']
        if date_from and date_to:
            meals = Meal.objects.filter(date__range=(date_from, date_to))
            for meal in meals:
                mealDate = meal.date.strftime('%d/%m/%Y')
                if mealsSum.get(mealDate) is None:
                    mealsSum[mealDate] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                mealCounts = meal.get_counts()
                for i, mealTypes in enumerate(mealCounts):
                    for j, dietCount in enumerate(mealTypes):
                        mealsSum[mealDate][i][j] += dietCount
    return JsonResponse({'mealsSum': mealsSum})
