# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_auto_20160914_2254'),
    ]

    operations = [
        migrations.AddField(
            model_name='guest',
            name='note',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='guest',
            name='recommended',
            field=models.BooleanField(default=False),
        ),
    ]
