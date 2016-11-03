# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_auto_20161029_1749'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='date',
            new_name='date_from',
        ),
        migrations.AddField(
            model_name='event',
            name='date_to',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='type',
            field=models.IntegerField(default=1, choices=[(1, 'LITURGICAL'), (2, 'COMMUNITY')]),
            preserve_default=False,
        ),
    ]
