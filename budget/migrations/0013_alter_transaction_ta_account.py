# Generated by Django 4.0.5 on 2022-10-01 16:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0012_account_balance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='ta_account',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='accounts', to='budget.account'),
        ),
    ]
