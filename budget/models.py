from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser

# Create your models here.

class BudgetUser(AbstractUser):
    display_name = models.CharField(max_length = 32)

class BaseModel(models.Model):
    class Meta:
        abstract = True
    owner = models.ForeignKey(BudgetUser, related_name='+', on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(auto_now_add = True)
    last_modified = models.DateTimeField(auto_now = True)
    visible = models.BooleanField(default = True)
    deleted = models.BooleanField(default = False)

class Group(BaseModel):
    name = models.CharField(max_length = 32)
    on_budget = models.BooleanField(default = True)
    on_transaction = models.BooleanField(default = True)
    def __str__(self):
        return self.name

class Bucket(BaseModel):
    name = models.CharField(max_length = 32)
    parent = models.ForeignKey(Group, related_name='bucket', on_delete=models.RESTRICT, null=True)
    on_budget = models.BooleanField(default = True)
    on_transaction = models.BooleanField(default = True)
    transfer = models.BooleanField(default = False)
    def __str__(self):
        return self.name

class Month(models.Model):
    short_name = models.CharField(max_length = 8)
    long_name = models.CharField(max_length = 32)
    start_date = models.DateField()
    end_date = models.DateField()
    def __str__(self):
        return self.long_name

class MonthlyBudget(BaseModel):
    month = models.ForeignKey(Month, related_name='budget_month', on_delete=models.RESTRICT)
    amount = models.DecimalField(decimal_places = 2, max_digits = 11, default = 0)
    category = models.ForeignKey(Bucket, related_name='monthly_budget', on_delete=models.RESTRICT, null=True)

class Account(BaseModel):
    name = models.CharField(max_length = 32)
    balance = models.DecimalField(decimal_places = 2, max_digits = 11, default = 0)
    class AccountType(models.IntegerChoices):
        CASH = 0
        CHECKING = 1
        SAVINGS = 2
        CREDIT_CARD = 3

    account_type = models.IntegerField(choices=AccountType.choices)

    def is_cc_account(self):
        return self.account_type == self.AccountType.CREDIT_CARD
    def __str__(self):
        return self.name

class Payee(BaseModel):
    linked_bucket = models.ForeignKey(Bucket, related_name='payee', on_delete=models.RESTRICT, null=True)
    name = models.CharField(max_length = 32)
    def __str__(self):
        return self.name


class Transaction(BaseModel):
    ta_date = models.DateField(default = date.today)
    month = models.ForeignKey(Month, related_name='month', on_delete=models.RESTRICT)
    ta_payee = models.ForeignKey(Payee, related_name='payees', on_delete=models.RESTRICT, null=True)
    ta_account = models.ForeignKey(Account, related_name='accounts', on_delete=models.CASCADE, null=True)
    ta_bucket = models.ForeignKey(Bucket, related_name='buckets', on_delete=models.RESTRICT, null=True)
    note = models.TextField(max_length = 255, blank=True, default='')
    in_amount = models.DecimalField(decimal_places = 2, max_digits = 11, default = 0)
    out_amount = models.DecimalField(decimal_places = 2, max_digits = 11, default = 0)
    cleared = models.BooleanField(default = False)
    reconciled = models.BooleanField(default = False)
    system = models.BooleanField(default = False)
    transfer_pair = models.OneToOneField('Transaction', on_delete=models.CASCADE, null = True, default=None)
    cc_debt = models.BooleanField(default = False)

    def __str__(self):
        return "{} {} {}".format(self.ta_account, self.ta_payee, self.ta_bucket)
