# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_auto_20160804_2239'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='index',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='approved',
            field=models.BooleanField(default=False),
        ),
    ]
