from django.urls import path
from budget import views
prefix = 'api/'
urlpatterns = [
        path(prefix + 'group', views.GroupList.as_view()),
        path(prefix + 'bucket', views.BucketList.as_view()),
        path(prefix + 'account', views.AccountList.as_view()),
        path(prefix + 'monthlybudget', views.AccountList.as_view()),
        path(prefix + 'payee', views.PayeeList.as_view()),
        path(prefix + 'transaction', views.TransactionList.as_view())
        ]

