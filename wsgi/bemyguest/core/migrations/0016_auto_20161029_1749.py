# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_auto_20161016_2041'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Feast',
            new_name='Event',
        ),
        migrations.AlterField(
            model_name='roomreservation',
            name='guests',
            field=models.ManyToManyField(related_name='room_reservations', to='core.Guest', blank=True),
        ),
    ]
