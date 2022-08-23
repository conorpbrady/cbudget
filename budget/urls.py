from django.urls import path
from budget import views
from rest_framework_simplejwt import views as jwt_views
prefix = 'api/'
urlpatterns = [
        path(prefix + 'group', views.GroupList.as_view()),
        path(prefix + 'bucket', views.BucketList.as_view()),
        path(prefix + 'account', views.AccountList.as_view()),
        path(prefix + 'monthlybudget', views.MonthlyBudgetList.as_view()),
        path(prefix + 'monthlybudget/entry/<int:id>', views.MonthlyBudgetUpdate.as_view()),
        path(prefix + 'monthlysum', views.MonthlySumList.as_view()),
        path(prefix + 'payee', views.PayeeList.as_view()),
        path(prefix + 'transaction', views.TransactionList.as_view()),
        path(prefix + 'category', views.CategoryList.as_view()),

        path(prefix + 'user/create/', views.BudgetUserCreate.as_view(), name='create_user'),
        path(prefix + 'token/obtain/', views.CustomTokenObtainPairView.as_view(), name='token_create'),
        path(prefix + 'token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
        path(prefix + 'token/verify', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
        path(prefix + 'blacklist', views.LogoutAndBlacklistRefreshTokenView.as_view(), name='blacklist')
        ]


