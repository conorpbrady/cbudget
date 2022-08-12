# Generated by Django 4.0.6 on 2022-08-12 15:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0004_month'),
    ]

    operations = [
        migrations.AlterField(
            model_name='monthlybudget',
            name='month',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='budget_month', to='budget.month'),
        ),
    ]
