# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_remove_guest_address_zip'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2016, 7, 20, 20, 48, 26, 718000, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='reservation',
            name='date_modified',
            field=models.DateTimeField(default=datetime.datetime(2016, 7, 20, 20, 48, 32, 9000, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]
