# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_auto_20160731_1346'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='meal',
            name='count',
        ),
        migrations.RemoveField(
            model_name='meal',
            name='diet_type',
        ),
        migrations.RemoveField(
            model_name='meal',
            name='type',
        ),
        migrations.AddField(
            model_name='meal',
            name='counts',
            field=models.TextField(null=True, blank=True),
        ),
    ]
