from django.contrib import admin
from .models import Group, Bucket, MonthlyBudget, Account, Transaction, Payee
# Register your models here.

admin.site.register(Group)
admin.site.register(Bucket)
admin.site.register(MonthlyBudget)
admin.site.register(Account)
admin.site.register(Transaction)
admin.site.register(Payee)
