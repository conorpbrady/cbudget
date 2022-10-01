from django.apps import AppConfig
from django.db.models.signals import post_save, pre_delete


class BudgetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'budget'

    def ready(self):
        from budget.signals import create_system_categories, on_account_create, on_account_delete
        budget_user = self.get_model('BudgetUser')
        account = self.get_model('Account')
        post_save.connect(create_system_categories, sender=budget_user)
        post_save.connect(on_account_create, sender=account)
        pre_delete.connect(on_account_delete, sender=account)
