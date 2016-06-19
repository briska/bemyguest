from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from core.models import Reservation
from core.serializers import serialize_reservation
from django.http.response import JsonResponse


@csrf_exempt
def reservations(request):
    if request.user.is_anonymous():
        raise SuspiciousOperation('Logged out.')
    reservations = [serialize_reservation(reservation) for reservation in Reservation.objects.all()]
    return JsonResponse({'reservations': reservations}, safe=False)
    raise SuspiciousOperation('Error.')