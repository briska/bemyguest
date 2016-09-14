from django.db import models
from django.utils.translation import ugettext_lazy as _
import json

class Setting(models.Model):
    key = models.CharField(max_length=32)
    value = models.TextField(blank=True)

    def __unicode__(self):
        return '%s: %s' % (self.key, self.value)

# keep in sync with feast-colors in style.scss
FEAST_COLORS = (
    (1, _('RED')),
    (2, _('GREEN')),
    (3, _('BLUE')),
    (4, _('PINK')),
    (5, _('VIOLET')),
    (6, _('TURQUOISE')),
    (7, _('WHITE'))
)


class Feast(models.Model):
    name = models.CharField(max_length=64)
    date = models.DateField()
    color = models.IntegerField(choices=FEAST_COLORS)

    def __unicode__(self):
        return '%s: %s' % (self.date, self.name)

class House(models.Model):
    name = models.TextField(max_length=64)

    def __unicode__(self):
        return '%s' % (self.name)


class Room(models.Model):
    house = models.ForeignKey(House, related_name='rooms')
    name = models.TextField(max_length=64)
    capacity = models.IntegerField()
    index = models.IntegerField(default=0)

    class Meta:
        ordering = ['index']

    def __unicode__(self):
        return '%s - %s' % (self.house.name, self.name)


class Reservation(models.Model):
    name = models.TextField(max_length=64, blank=True)
    guests_count = models.IntegerField(default=0)
    contact_name = models.TextField(blank=True)
    contact_mail = models.EmailField(blank=True)
    contact_phone = models.TextField(blank=True)
    purpose = models.TextField(blank=True)
    spiritual_guide = models.TextField(blank=True)
    price_housing = models.FloatField(default=0)
    price_spiritual = models.FloatField(default=0)
    price_payed = models.FloatField(default=0)
    approved = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    mail_communication = models.TextField(blank=True)

    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '%s' % (self.name if self.name else self.contact_name)


class Guest(models.Model):
    name_prefix = models.TextField(blank=True)
    name = models.TextField()
    surname = models.TextField()
    name_suffix = models.TextField(blank=True)
    address_street = models.TextField(blank=True)
    address_number = models.TextField(blank=True)
    address_city = models.TextField(blank=True)
    phone = models.TextField(blank=True)

    def __unicode__(self):
        return '%s %s %s %s' % (self.name_prefix, self.name, self.surname, self.name_suffix)


class RoomReservation(models.Model):
    room = models.ForeignKey(Room, related_name='room_reservations')
    reservation = models.ForeignKey(Reservation, related_name='room_reservations')
    date_from = models.DateTimeField()
    date_to = models.DateTimeField()
    guests = models.ManyToManyField(Guest, blank=True)

    class Meta:
        ordering = ['room__index']

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
    date = models.DateField()
    counts = models.TextField(null=True, blank=True)

    unique_together = ('reservation', 'date')

    def set_counts(self, counts):
        self.counts = json.dumps(counts)

    def get_counts(self):
        counts = json.loads(self.counts)
        if isinstance(counts, list):
            return counts
        return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

    def __unicode__(self):
        return '%s, %s' % (self.reservation, self.date)

