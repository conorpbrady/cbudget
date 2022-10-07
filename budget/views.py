from rest_framework.decorators import api_view
from rest_framework import status, permissions, generics, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Sum
from django.db import connection

from .models import *
from .serializers import *
# Create your views here.

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class LogoutAndBlacklistRefreshTokenView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data['token']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status = status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(e)
            return Response(status = status.HTTP_400_BAD_REQUEST)

class MultipleFieldLookupMixin(object):

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        filter = {}
        for field in self.lookup_fields:
            if self.kwargs.get(field, None):
                filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj

class BudgetUserCreate(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = BudgetUserSerializer

class GroupList(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    def get_queryset(self):
        return Group.objects.filter(owner = self.request.user, on_transaction=True, on_budget=True)

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

class GroupDetail(generics.GenericAPIView, mixins.DestroyModelMixin):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class BucketList(generics.ListCreateAPIView):
    serializer_class = BucketSerializer
    def get_queryset(self):
        return Bucket.objects.filter(owner = self.request.user, on_transaction=True, on_budget=True)

    def perform_create(self, serializer):
        parent = Group(self.request.data['parent'])
        serializer.save(owner = self.request.user, parent = parent)

class BucketDetail(generics.GenericAPIView, mixins.DestroyModelMixin):
    queryset = Bucket.objects.all()
    serializer_class = BucketSerializer

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class AccountList(generics.ListCreateAPIView):
    serializer_class = AccountSerializer
    def get_queryset(self):
        return Account.objects.filter(owner = self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

class AccountDetail(generics.GenericAPIView, mixins.DestroyModelMixin):
    queryset = Account.objects.all();
    serializer_class = AccountSerializer

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class MonthList(generics.ListAPIView):
    serializer_class = MonthSerializer
    def get_queryset(self):
        root_month = self.request.query_params['center']
        min_delta = 12
        max_delta = 12
        root_month_id = Month.objects.get(short_name = root_month).id
        return Month.objects.filter(id__lte = (root_month_id + max_delta), id__gte = (root_month_id - min_delta))


class MonthlyBudgetList(generics.ListCreateAPIView):
    serializer_class = MonthlyBudgetSerializer
    def get_queryset(self):
        months = self.request.query_params['months'].split(',')
        return MonthlyBudget.objects.filter(owner = self.request.user, month__in = months)

    def perform_create(self, serializer):
        month = Month.objects.get(id = self.request.data['month'])
        category = Bucket.objects.get(id = self.request.data['category'], on_budget=True)
        serializer.save(owner = self.request.user, month = month, category = category)


class MonthlyBudgetUpdate(generics.UpdateAPIView):
    serializer_class = MonthlyBudgetSerializer
    queryset = MonthlyBudget.objects.all()
    lookup_field = 'id'

class PayeeList(generics.ListCreateAPIView):
    serializer_class = PayeeSerializer
    def get_queryset(self):
        return Payee.objects.filter(owner = self.request.user, visible = True)

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

class TransactionList(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    def get_queryset(self):
        return Transaction.objects.filter(owner = self.request.user)

    def perform_create(self, serializer):
        ta_account = Account.objects.get(id = self.request.data['account_id'])
        ta_payee = Payee.objects.get(id = self.request.data['payee_id'])
        ta_bucket = Bucket.objects.get(id = self.request.data['category_id'], on_transaction=True)
        query_date = self.request.data['ta_date']

        month = Month.objects.get(start_date__lte = query_date, end_date__gte = query_date)

        serializer.save(
                owner = self.request.user,
                month = month,
                ta_account = ta_account,
                ta_payee = ta_payee,
                ta_bucket = ta_bucket
                )

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    lookup_field = 'id'
    def get_queryset(self):
        return Transaction.objects.all()

    def perform_update(self, serializer):
        ta_account = Account.objects.get(id = self.request.data['account_id'])
        ta_payee = Payee.objects.get(id = self.request.data['payee_id'])
        ta_bucket = Bucket.objects.get(id = self.request.data['category_id'])
        query_date = self.request.data['ta_date']

        month = Month.objects.get(start_date__lte = query_date, end_date__gte = query_date)

        serializer.save(
                owner = self.request.user,
                month = month,
                ta_account = ta_account,
                ta_payee = ta_payee,
                ta_bucket = ta_bucket
                )

class CategoryList(generics.ListAPIView):
    serializer_class = CategorySerializer
    def get_queryset(self):
        on_transaction = None
        on_budget = None
        if 'transaction' in self.request.query_params:
            on_transaction = self.request.query_params['transaction'].lower() == 'true'

        if 'budget' in self.request.query_params:
            on_budget = self.request.query_params['budget'].lower() == 'true'

        if on_budget is None and on_transaction is None:
            return Group.objects.filter(owner = self.request.user)
        elif on_budget is not None and on_transaction is None:
            return Group.objects.filter(owner = self.request.user, on_budget = on_budget)
        elif on_budget is None and on_transaction is not None:
            return Group.objects.filter(owner = self.request.user, on_transaction=on_transaction)
        else:
            return Group.objects.filter(owner = self.request.user, on_transaction = on_transaction, on_budget = on_budget)

class MonthlySumList(generics.ListAPIView):
    serializer_class = MonthlySumSerializer
    def get_queryset(self):
        months = self.request.query_params['months'].split(',')
        # Amount Budgeted by Month and Category
        # SELECT Month, Category,  SUM(AMOUNT) FROM MonthlyBudget
        #  WHERE Month IN (1,2,3) GROUP_BY Month, Category
        return MonthlyBudget.objects.filter(owner = self.request.user, month__in = months) \
               .values('month', 'category__parent').annotate(budget_amount = Sum('amount'))

        # Amount Spent by Month and Category
        # SELECT Month, Category, SUM(AMOUNT) FROM Transactions
        # WHERE Month IN (1,2,3) GROUP_BY Month, Category
        # Transaction.objects.filter(owner = self.request.user, month__in = months) \
        #       .values('month', 'category', 'amount').annotate(sum('amount'));

class TransactionSumList(generics.ListAPIView):
    serializer_class = TransactionSumSerializer
    def get_queryset(self):
        months = self.request.query_params['months'].split(',')
        return Transaction.objects.filter( \
                owner = self.request.user, month__in = months) \
                .values('month', 'ta_bucket') \
                .annotate(ta_amount = (Sum('in_amount') - Sum('out_amount')))

class CumSumList(viewsets.ViewSet):

    query_string = """
WITH GroupedTransactions AS
        (
            SELECT month_id, ta_bucket_id, SUM(in_amount) AS Income, SUM(out_amount) AS Expenditures
            FROM budget_transaction WHERE owner_id={0} GROUP BY month_id, ta_bucket_id

        ),
		MonthCat AS (
			SELECT mb.month_id as month,
            mb.category_id as category
			from budget_monthlybudget mb
            WHERE mb.owner_id = 9
			UNION
			SELECT
			t.month_id as month,
			t.ta_bucket_id as category
			FROM GroupedTransactions t
		),
        MonthSums AS
        (
            SELECT mc.month as month,
            mc.category as category,
            SUM(mb.Amount) as budgetAmount,
            t.Income as income,
            t.Expenditures as expenditures,
            t.Income - t.Expenditures as transactionAmount
            FROM MonthCat mc
			LEFT JOIN budget_monthlybudget as mb ON mb.month_id = mc.month and mb.category_id = mc.category and mb.owner_id = {0}
            LEFT JOIN budget_month as m ON m.id = mc.month
            LEFT JOIN budget_bucket as c ON c.id = mc.category
			LEFT JOIN GroupedTransactions as t ON mc.month = t.month_id and mc.category = t.ta_bucket_id
            GROUP BY mc.month, mc.category
        )

        SELECT ms1.month,
        ms1.category,
        ms1.budgetAmount as budgetAmount,
        ms1.income as income,
        ms1.expenditures as expenditures,
        ms1.transactionAmount as transactionAmount,
        SUM(ms2.BudgetAmount) as budgetSum,
        SUM(ms2.transactionAmount) as transactionSum FROM MonthSums ms1
        INNER JOIN MonthSums ms2 on ms1.Month >= ms2.Month AND ms1.Category = ms2.Category
        GROUP BY ms1.Month, ms1.Category
    """

    def list(self, request):
        owner_id = self.request.user.id

        with connection.cursor() as cursor:
            cursor.execute(self.query_string.format(owner_id))
            columns = [col[0] for col in cursor.description]
            instance = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
                ]
        serializer = CumSumSerializer(instance, many = True)
        return Response(serializer.data)
