# Generated by Django 4.0.5 on 2022-10-09 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0016_alter_transaction_transfer_pair'),
    ]

    operations = [
        migrations.AddField(
            model_name='bucket',
            name='transfer',
            field=models.BooleanField(default=False),
        ),
    ]
