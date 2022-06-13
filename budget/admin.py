from django.contrib import admin
from .models import BudgetUser, Group, Bucket, MonthlyBudget, Account, Transaction, Payee
from django.contrib.auth.admin import UserAdmin
# Register your models here.

admin.site.register(BudgetUser, UserAdmin)
admin.site.register(Group)
admin.site.register(Bucket)
admin.site.register(MonthlyBudget)
admin.site.register(Account)
admin.site.register(Transaction)
admin.site.register(Payee)
