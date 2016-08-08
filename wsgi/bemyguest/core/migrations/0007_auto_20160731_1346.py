# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_auto_20160720_2248'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='price_payed',
            field=models.FloatField(default=0),
        ),
    ]
