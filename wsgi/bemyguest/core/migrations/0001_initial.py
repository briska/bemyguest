# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Guest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name_prefix', models.TextField(blank=True)),
                ('name', models.TextField()),
                ('surname', models.TextField()),
                ('name_suffix', models.TextField(blank=True)),
                ('address_street', models.TextField(blank=True)),
                ('address_number', models.TextField(blank=True)),
                ('address_city', models.TextField(blank=True)),
                ('address_zip', models.TextField(max_length=5, blank=True)),
                ('phone', models.TextField(blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='House',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.TextField(max_length=64)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.IntegerField(choices=[(0, b'BREAKFAST'), (1, b'LUNCH'), (2, b'DINNER')])),
                ('diet_type', models.IntegerField(choices=[(0, b'NONE_DIET'), (1, b'SAVING_DIET'), (2, b'DIABETIC_DIET'), (3, b'GLUTENFREE_DIET')])),
                ('date', models.DateField()),
                ('count', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('contact_name', models.TextField(blank=True)),
                ('contact_mail', models.EmailField(max_length=75, blank=True)),
                ('contact_phone', models.TextField(blank=True)),
                ('purpose', models.TextField(blank=True)),
                ('spiritual_guide', models.TextField(blank=True)),
                ('price_housing', models.FloatField(default=0)),
                ('price_spiritual', models.FloatField(default=0)),
                ('price_payed', models.FloatField(blank=True)),
                ('approved', models.BooleanField(default=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.TextField(max_length=64)),
                ('capacity', models.IntegerField()),
                ('house', models.ForeignKey(related_name=b'rooms', to='core.House')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='RoomReservation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_from', models.DateTimeField()),
                ('date_to', models.DateTimeField()),
                ('guests', models.ManyToManyField(to='core.Guest', blank=True)),
                ('reservation', models.ForeignKey(related_name=b'room_reservations', to='core.Reservation')),
                ('room', models.ForeignKey(related_name=b'room_reservations', to='core.Room')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Setting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('key', models.TextField(max_length=32)),
                ('value', models.TextField(blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='meal',
            name='reservation',
            field=models.ForeignKey(related_name=b'meals', to='core.Reservation'),
            preserve_default=True,
        ),
    ]
