# Generated by Django 4.0.5 on 2022-06-13 13:47

import datetime
from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='BudgetUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('visible', models.BooleanField(default=True)),
                ('deleted', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=32)),
                ('account_type', models.IntegerField(choices=[(0, 'Cash'), (1, 'Checking'), (2, 'Savings'), (3, 'Credit Card')])),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Bucket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('visible', models.BooleanField(default=True)),
                ('deleted', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=32)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('visible', models.BooleanField(default=True)),
                ('deleted', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=32)),
                ('linked_bucket', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='payee', to='budget.bucket')),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('visible', models.BooleanField(default=True)),
                ('deleted', models.BooleanField(default=False)),
                ('ta_date', models.DateField(default=datetime.date.today)),
                ('note', models.TextField(blank=True, default='', max_length=255)),
                ('in_amount', models.DecimalField(decimal_places=2, default=0, max_digits=11)),
                ('out_amount', models.DecimalField(decimal_places=2, default=0, max_digits=11)),
                ('cleared', models.BooleanField(default=False)),
                ('reconciled', models.BooleanField(default=False)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('ta_account', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='transaction', to='budget.account')),
                ('ta_bucket', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='transaction', to='budget.bucket')),
                ('ta_payee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='transaction', to='budget.payee')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MonthlyBudget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('visible', models.BooleanField(default=True)),
                ('deleted', models.BooleanField(default=False)),
                ('month', models.CharField(max_length=32)),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=11)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='monthly_budget', to='budget.bucket')),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('visible', models.BooleanField(default=True)),
                ('deleted', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=32)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='bucket',
            name='parent',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='bucket', to='budget.group'),
        ),
    ]
