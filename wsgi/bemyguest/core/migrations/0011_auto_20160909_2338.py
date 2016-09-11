# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_auto_20160909_2326'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feast',
            name='date',
            field=models.DateField(),
        ),
    ]
