# Generated by Django 4.0.6 on 2022-08-27 10:13

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0005_alter_monthlybudget_month'),
    ]

    operations = [
        migrations.AddField(
            model_name='month',
            name='end_date',
            field=models.DateField(default=datetime.date.today),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='month',
            name='start_date',
            field=models.DateField(default=datetime.date.today),
            preserve_default=False,
        ),
    ]
