# Generated by Django 4.0.5 on 2022-10-01 17:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0013_alter_transaction_ta_account'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='system',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='transaction',
            name='transfer_pair',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='budget.transaction'),
        ),
    ]
