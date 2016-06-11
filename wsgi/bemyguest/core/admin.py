from django.contrib import admin
from core.models import Guest, House, Meal, Reservation, Room, RoomReservation, Setting

# Register your models here.

class RoomReservationInline(admin.StackedInline):
    model = RoomReservation

class ReservationAdmin(admin.ModelAdmin):
    inlines = [RoomReservationInline,]


admin.site.register(Guest)
admin.site.register(House)
admin.site.register(Meal)
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(Room)
admin.site.register(Setting)
