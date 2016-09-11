# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20160827_2147'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feast',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=64)),
                ('date', models.DateField(auto_now_add=True)),
                ('color', models.IntegerField(choices=[(0, 'RED'), (1, 'GREEN'), (2, 'BLUE'), (3, 'PINK'), (4, 'VIOLET'), (5, 'TURQUOISE'), (6, 'WHITE')])),
            ],
        ),
        migrations.AlterField(
            model_name='setting',
            name='key',
            field=models.CharField(max_length=32),
        ),
    ]
