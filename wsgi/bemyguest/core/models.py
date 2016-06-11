from django.db import models

class Setting(models.Model):
    key = models.TextField(max_length=32)
    value = models.TextField(blank=True)
    
    def __unicode__(self):
        return '%s: %s' % (self.key, self.value)


class House(models.Model):
    name = models.TextField(max_length=64)
    
    def __unicode__(self):
        return '%s' % (self.name)


class Room(models.Model):
    house = models.ForeignKey(House, related_name='rooms')
    name = models.TextField(max_length=64)
    capacity = models.IntegerField()
    
    def __unicode__(self):
        return '%s - %s' % (self.house.name, self.name)


class Reservation(models.Model):
    contact_name = models.TextField(blank=True)
    contact_mail = models.EmailField(blank=True)
    contact_phone = models.TextField(blank=True)
    purpose = models.TextField(blank=True)
    spiritual_guide = models.TextField(blank=True)
    price_housing = models.FloatField(default=0)
    price_spiritual = models.FloatField(default=0)
    price_payed = models.FloatField(null=True, blank=True)
    approved = models.BooleanField(default=True)
    
    def __unicode__(self):
        return '%s' % (self.contact_name)


class Guest(models.Model):
    name_prefix = models.TextField(blank=True)
    name = models.TextField()
    surname = models.TextField()
    name_suffix = models.TextField(blank=True)
    address_street = models.TextField(blank=True)
    address_number = models.TextField(blank=True)
    address_city = models.TextField(blank=True)
    address_zip = models.TextField(max_length=5, blank=True)
    phone = models.TextField(blank=True)
    
    def __unicode__(self):
        return '%s %s %s %s' % (self.name_prefix, self.name, self.surname, self.name_suffix)


class RoomReservation(models.Model):
    room = models.ForeignKey(Room, related_name='room_reservations')
    reservation = models.ForeignKey(Reservation, related_name='room_reservations')
    date_from = models.DateTimeField()
    date_to = models.DateTimeField()
    guests = models.ManyToManyField(Guest, blank=True)
    
    def __unicode__(self):
        return '%s - %s' % (self.room.name, self.reservation.contact_name)


MEAL_TYPES = {
    0: 'BREAKFAST',
    1: 'LUNCH',
    2: 'DINNER',
}


MEAL_DIET_TYPES = {
    0: 'NONE_DIET',
    1: 'SAVING_DIET',
    2: 'DIABETIC_DIET',
    3: 'GLUTENFREE_DIET',
}


class Meal(models.Model):
    reservation = models.ForeignKey(Reservation, related_name='meals')
    type = models.IntegerField(choices=MEAL_TYPES.items())
    diet_type = models.IntegerField(choices=MEAL_DIET_TYPES.items())
    date = models.DateField()
    count = models.IntegerField()
    
    def __unicode__(self):
        return '%s, %s - %s (%s): %s' % (self.reservation.contact_name, self.date, self.type, self.diet_type, self.count)

    