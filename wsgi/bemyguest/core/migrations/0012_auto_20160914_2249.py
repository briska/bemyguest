# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_auto_20160909_2338'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='room',
            options={'ordering': ['index']},
        ),
        migrations.AlterField(
            model_name='feast',
            name='color',
            field=models.IntegerField(choices=[(1, 'RED'), (2, 'GREEN'), (3, 'BLUE'), (4, 'PINK'), (5, 'VIOLET'), (6, 'TURQUOISE'), (7, 'WHITE')]),
        ),
    ]
