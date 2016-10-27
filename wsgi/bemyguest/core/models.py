from django.db import models
from django.utils.translation import ugettext_lazy as _
import json
from collections import OrderedDict
from django.db.models import Q

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
        return self.get_reservation_title()

    def update_prices(self):
        date_from = self.get_date_from().replace(hour=0, minute=0, second=0, microsecond=0)
        date_to = self.get_date_to().replace(hour=0, minute=0, second=0, microsecond=0)
        days = (date_to - date_from).days + 1
        self.price_housing = days * 16 + 1
        self.price_spiritual = days * 2
        self.save()

    def get_date_from(self):
        return self.room_reservations.order_by('date_from').values().first()['date_from']

    def get_date_to(self):
        return self.room_reservations.order_by('-date_to').values().first()['date_to']

    def get_reservation_title(self):
        return self.name if self.name else self.contact_name

class Guest(models.Model):
    name_prefix = models.TextField(blank=True)
    name = models.TextField()
    surname = models.TextField()
    name_suffix = models.TextField(blank=True)
    address_street = models.TextField(blank=True)
    address_number = models.TextField(blank=True)
    address_city = models.TextField(blank=True)
    phone = models.TextField(blank=True)
    recommended = models.BooleanField(default=True)
    note = models.TextField(blank=True)

    def __unicode__(self):
        return '%s %s %s %s' % (self.name_prefix, self.name, self.surname, self.name_suffix)


class RoomReservation(models.Model):
    room = models.ForeignKey(Room, related_name='room_reservations')
    reservation = models.ForeignKey(Reservation, related_name='room_reservations')
    date_from = models.DateTimeField()
    date_to = models.DateTimeField()
    guests = models.ManyToManyField(Guest, blank=True, related_name='room_reservations')

    class Meta:
        ordering = ['room__index']

    def __unicode__(self):
        return '%s - %s' % (self.room.name, self.reservation.contact_name)

    @staticmethod
    def get_occupation(date_from, date_to):
        occupations = OrderedDict()
        room_reservations = RoomReservation.objects.filter(
            (Q(date_from__gte=(date_from)) & Q(date_from__lte=(date_to))) |
            (Q(date_to__gte=(date_from)) & Q(date_to__lte=(date_to))) |
            (Q(date_from__lt=(date_from)) & Q(date_to__gt=(date_to)))
            ).order_by('date_from')
        for rr in room_reservations:
            print rr.room, rr.reservation, rr.date_from
#         meals_sum = OrderedDict()
#         meals = Meal.objects.filter(date__range=(date_from, date_to)).order_by('date')
#         for meal in meals:
#             meal_date = meal.date.strftime('%Y-%m-%d')
#             if meals_sum.get(meal_date) is None:
#                 meals_sum[meal_date] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
#             meal_counts = meal.get_counts()
#             for i, mealTypes in enumerate(meal_counts):
#                 for j, dietCount in enumerate(mealTypes):
#                     meals_sum[meal_date][i][j] += dietCount
#         return meals_sum



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
        return '%s, %s' % (self.reservation.get_reservation_title(), self.date)

    @staticmethod
    def get_meals_sum(date_from, date_to):
        meals_sum = OrderedDict()
        meals = Meal.objects.filter(date__range=(date_from, date_to)).order_by('date')
        for meal in meals:
            meal_date = meal.date.strftime('%Y-%m-%d')
            if meals_sum.get(meal_date) is None:
                meals_sum[meal_date] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            meal_counts = meal.get_counts()
            for i, mealTypes in enumerate(meal_counts):
                for j, dietCount in enumerate(mealTypes):
                    meals_sum[meal_date][i][j] += dietCount
        return meals_sum
