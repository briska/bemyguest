# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_auto_20161030_0113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date_to',
            field=models.DateField(null=True, blank=True),
        ),
    ]
