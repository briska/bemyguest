def serialize_house(house):
    return {
        'id': house.id,
        'name': house.name,
        'rooms': [room.id for room in house.rooms.all()],
    }

def serialize_room(room):
    return {
        'id': room.id,
        'name': room.name,
        'house': room.house_id,
        'capacity': room.capacity,
    }

def serialize_reservation(reservation):
    return {
        'id': reservation.id,
        'contact_name': reservation.contact_name,
        'contact_mail': reservation.contact_mail,
        'contact_phone': reservation.contact_phone,
    }

def serialize_user(user):
    return {
        'id': user.id,
        'username': user.username,
        'mail': user.email,
    }
