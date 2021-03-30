from .models import *
from datetime import date, datetime
from django.db.models import Q


def convert_to_date(date_string, f="%d-%m-%Y"):
    if date_string is not None:
        return datetime.strptime(date_string, "%d-%m-%Y").date()
    else:
        return date.today() 


def room_available(room_id, from_, to_):
    is_available = Bookings.objects.filter(Q(room__id=room_id),
                                            (
                                                (Q(check_in__gte=from_) & Q(check_in__lt=to_)) |
                                                (Q(check_out__gt=from_) & Q(check_out__lt=to_))
                                            )).exclude(is_canceled=True).exists()
    
    return not is_available
                                

def add_new_booking(room_id, guest_id, staff_id, check_in, check_out):
    if check_in < date.today() or check_in > check_out:
        return None

    ok = room_available(room_id, check_in, check_out)
    if not ok:
        return None

    new_booking = Bookings(room_id=room_id, guest_id=guest_id, check_in=check_in, 
                            check_out=check_out, by_staff_id=staff_id)
    new_booking.save()
    
    return new_booking   