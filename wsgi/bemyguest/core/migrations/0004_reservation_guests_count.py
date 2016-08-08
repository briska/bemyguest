# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20160718_2044'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='guests_count',
            field=models.IntegerField(default=0),
        ),
    ]
