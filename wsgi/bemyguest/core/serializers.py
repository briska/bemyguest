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