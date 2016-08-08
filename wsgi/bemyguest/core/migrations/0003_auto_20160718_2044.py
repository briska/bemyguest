# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20160611_1607'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='mail_communication',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='reservation',
            name='name',
            field=models.TextField(max_length=64, blank=True),
        ),
        migrations.AddField(
            model_name='reservation',
            name='notes',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='contact_mail',
            field=models.EmailField(max_length=254, blank=True),
        ),
    ]
