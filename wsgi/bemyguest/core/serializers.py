from core.utils import can_read, can_edit
def serialize_house(house):
    return {
        'id': house.id,
        'name': house.name,
        'roomIds': [room.id for room in house.rooms.all()],
    }

def serialize_room(room):
    return {
        'id': room.id,
        'name': room.name,
        'houseId': room.house_id,
        'capacity': room.capacity,
    }

def serialize_guest(guest):
    visits = []
    for roomReservation in guest.ordered_visits:
        visit = {}
        visit['id'] = roomReservation.id
        visit['date_from'] = roomReservation.date_from
        visit['date_to'] = roomReservation.date_to
        visits.append(visit)

    return {
        'id': guest.id,
        'namePrefix': guest.name_prefix,
        'name': guest.name,
        'surname': guest.surname,
        'nameSuffix': guest.name_suffix,
        'addressStreet': guest.address_street,
        'addressNumber': guest.address_number,
        'addressCity': guest.address_city,
        'phone': guest.phone,
        'recommended': guest.recommended,
        'note': guest.note,
        'visits': [serialize_visit(v) for v in visits],
    }


def serialize_visit(visit):
    return {
        'id': visit['id'],
        'dateFrom': visit['date_from'],
        'dateTo': visit['date_to'],
    }


def serialize_room_reservation(room_reservation):
    return {
        'id': room_reservation.id,
        'roomId': room_reservation.room_id,
        'dateFrom': room_reservation.date_from,
        'dateTo': room_reservation.date_to,
        'guests': [int(g) for g in room_reservation.guests.values_list('id', flat=True)],
    }

def serialize_meal(meal):
    return {
        'date': meal.date,
        'counts': meal.get_counts(),
    }

def serialize_reservation(reservation):
    return {
        'id': reservation.id,
        'name': reservation.name,
        'guestsCount': reservation.guests_count,
        'contactName': reservation.contact_name,
        'contactMail': reservation.contact_mail,
        'contactPhone': reservation.contact_phone,
        'purpose': reservation.purpose,
        'spiritualGuide': reservation.spiritual_guide,
        'pricePayed': reservation.price_payed,
        'priceHousing': reservation.price_housing,
        'priceSpiritual': reservation.price_spiritual,
        'approved': reservation.approved,
        'notes': reservation.notes,
        'mailCommunication': reservation.mail_communication,
        'date_created': reservation.date_created,
        'roomReservations': [serialize_room_reservation(room_reservation) for room_reservation in reservation.room_reservations.all()],
        'meals': [serialize_meal(meal) for meal in reservation.meals.all()],
    }

def serialize_user(user):
    return {
        'id': user.id,
        'username': user.username,
        'mail': user.email,
        'canRead': can_read(user),
        'canEdit': can_edit(user),
    }

def serialize_event(event):
    return {
        'id': event.id,
        'name': event.name,
        'type': event.type,
        'dateFrom': event.date_from,
        'dateTo': event.date_to,
        'color': event.color,
    }
