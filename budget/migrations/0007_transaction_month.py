# Generated by Django 4.0.6 on 2022-08-27 10:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0006_month_end_date_month_start_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='month',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.RESTRICT, related_name='month', to='budget.month'),
            preserve_default=False,
        ),
    ]
