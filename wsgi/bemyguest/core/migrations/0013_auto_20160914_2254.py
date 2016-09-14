# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_auto_20160914_2249'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='roomreservation',
            options={'ordering': ['room__index']},
        ),
    ]
