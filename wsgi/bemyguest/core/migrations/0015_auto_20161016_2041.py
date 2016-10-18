# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_auto_20161016_2038'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guest',
            name='recommended',
            field=models.BooleanField(default=True),
        ),
    ]
