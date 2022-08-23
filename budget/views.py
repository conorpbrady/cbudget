from rest_framework.decorators import api_view
from rest_framework import status, permissions, generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Sum

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
            print(field)
            if self.kwargs.get(field, None):
                filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)
        print(field)
        print(obj)
        self.check_object_permissions(self.request, obj)
        return obj

class BudgetUserCreate(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = BudgetUserSerializer

class GroupList(generics.ListCreateAPIView):
    serializer_class = GroupSerializer 
    def get_queryset(self):
        return Group.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

class BucketList(generics.ListCreateAPIView):
    serializer_class = BucketSerializer 
    def get_queryset(self):
        return Bucket.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        parent = Group(self.request.data['parent'])
        serializer.save(owner = self.request.user, parent = parent)

class AccountList(generics.ListCreateAPIView):
    serializer_class = AccountSerializer 
    def get_queryset(self):
        return Account.objects.filter(owner = self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user) 

class MonthlyBudgetList(generics.ListCreateAPIView):
    serializer_class = MonthlyBudgetSerializer 
    def get_queryset(self):
        months = self.request.query_params['months'].split(',')
        return MonthlyBudget.objects.filter(owner = self.request.user, month__in = months)
    
    def perform_create(self, serializer):
        month = Month.objects.get(id = self.request.data['month'])
        category = Bucket.objects.get(id = self.request.data['category'])
        serializer.save(owner = self.request.user, month = month, category = category)


class MonthlyBudgetUpdate(generics.UpdateAPIView):
    serializer_class = MonthlyBudgetSerializer
    queryset = MonthlyBudget.objects.all()
    lookup_field = 'id' 

class PayeeList(generics.ListCreateAPIView):
    serializer_class = PayeeSerializer 
    def get_queryset(self):
        return Payee.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

class TransactionList(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer 
    def get_queryset(self):
        return Transaction.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        ta_account = Account.objects.get(id = self.request.data['account'])
        ta_payee = Payee.objects.get(id = self.request.data['payee'])
        ta_bucket = Bucket.objects.get(id = self.request.data['category'])
        serializer.save(
                owner = self.request.user, 
                ta_account = ta_account, 
                ta_payee = ta_payee, 
                ta_bucket = ta_bucket
                )

class CategoryList(generics.ListAPIView):
    serializer_class = CategorySerializer
    def get_queryset(self):
        return Group.objects.filter(owner = self.request.user)

class MonthlySumList(generics.ListAPIView):
    serializer_class = MonthlySumSerializer
    def get_queryset(self):
        months = self.request.query_params['months'].split(',')
        # Amount Budgeted by Month and Category
        # SELECT Month, Category,  SUM(AMOUNT) FROM MonthlyBudget 
        #  WHERE Month IN (1,2,3) GROUP_BY Month, Category
        return MonthlyBudget.objects.filter(owner = self.request.user, month__in = months) \
               .values('month', 'category__parent').annotate(budget_amount = Sum('amount'));

        # Amount Spent by Month and Category
        # SELECT Month, Category, SUM(AMOUNT) FROM Transactions
        # WHERE Month IN (1,2,3) GROUP_BY Month, Category
        # Transaction.objects.filter(owner = self.request.user, month__in = months) \
        #       .values('month', 'category', 'amount').annotate(sum('amount'));

