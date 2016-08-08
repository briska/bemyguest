# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_reservation_guests_count'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='guest',
            name='address_zip',
        ),
    ]
