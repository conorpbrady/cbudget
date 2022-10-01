from django.db.models.signals import post_save
from budget.models import BudgetUser, Group, Bucket, Account

def create_system_categories(sender, instance, created, **kwargs):
    if created:
        transfer_group = Group(name='Transfers', owner=instance, on_budget=False, on_transaction=True)
        transfer_group.save()
        income_group = Group(name='Income', owner=instance, on_budget=False, on_transaction=True)
        income_group.save()
        debt_group = Group(name='Debt', owner=instance, on_budget=True, on_transaction=False)
        debt_group.save()

        income_bucket = Bucket(name='Income', owner=instance, parent=income_group, on_budget=False, on_transaction=True)
        income_bucket.save()

def create_debt_categories(sender, instance, created, **kwargs):
    if created:
        if instance.account_type == '3':
            debt_group = Group.objects.get(name='Debt', owner = instance.owner)
            debt_bucket = Bucket(
                    name=instance.name,
                    owner = instance.owner,
                    parent = debt_group,
                    on_budget=True,
                    on_transaction=False
                    )
            debt_bucket.save()

post_save.connect(create_system_categories, sender=BudgetUser)
post_save.connect(create_debt_categories, sender=Account)
