from django.db.models.signals import post_save, pre_delete
from django.db.models.deletion import RestrictedError

from datetime import datetime
from budget.models import BudgetUser, Group, Bucket, Account, Payee, Transaction, Month

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
        transfer_bucket = Bucket(name='Transfer', owner=instance, parent=transfer_group, on_budget=False, on_transaction=True, transfer=True)
        transfer_bucket.save()

def on_account_create(sender, instance, created, **kwargs):
    if created:
        payee = create_payee(instance)
        if instance.account_type == '3':
            bucket = create_debt_categories(instance)
        else:
            bucket = Bucket.objects.get(owner = instance.owner, name = "Income")
        create_starting_balance(instance, payee, bucket)

def on_account_delete(sender, instance, using,  **kwargs):

    # Account Model does not have on_delete = RESTRICT set
    # as pre delete signal is not sent w/ RESTRICT
    #
    # Manually checking to see if multiple transactions exist
    # If so, raise Restricted Exception, if not, remove first transaction then delete account

    if Transaction.objects.filter(owner= instance.owner, ta_account = instance).count() > 1:
        raise RestrictedError('Transactions exist for this account', instance)

    try:
        bucket = Bucket.objects.get(owner = instance.owner, name = '{} Paydown'.format(instance.name))
        transaction = Transaction.objects.get(owner = instance.owner, ta_bucket = bucket)
        transaction.delete()
        bucket.delete()
    except (Transaction.DoesNotExist, Bucket.DoesNotExist) as error:
        print(error)

def create_debt_categories(instance):
    debt_group = Group.objects.get(name='Debt', owner = instance.owner)
    debt_bucket = Bucket(
            name='{} Paydown'.format(instance.name),
            owner = instance.owner,
            parent = debt_group,
            on_budget=True,
            on_transaction=False
            )
    debt_bucket.save()
    return debt_bucket

def create_payee(instance):
    try:
        payee = Payee.objects.get(owner = instance.owner, name='Starting Balance')
    except Payee.DoesNotExist:
        payee = Payee(owner = instance.owner, name="Starting Balance", visible = False)
        payee.save()
    return payee


def create_starting_balance(instance, payee, debt_bucket):
    query_date = datetime.today().strftime('%Y-%m-%d')
    month = Month.objects.get(start_date__lte = query_date, end_date__gte = query_date)

    in_amount = 0
    out_amount = 0
    if instance.account_type == '3':
        out_amount = instance.balance
    else:
        in_amount = instance.balance

    starting_transaction = Transaction(
            owner = instance.owner,
            month = month,
            ta_payee = payee,
            ta_account = instance,
            ta_bucket = debt_bucket,
            note = "Pre-budget Debt",
            in_amount = in_amount,
            out_amount = out_amount,
            cleared = False,
            reconciled = False,
            system = True
            )
    starting_transaction.save()


post_save.connect(create_system_categories, sender=BudgetUser)

pre_delete.connect(on_account_delete, sender=Account)
post_save.connect(on_account_create, sender=Account)
