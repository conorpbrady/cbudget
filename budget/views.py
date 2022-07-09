from rest_framework.decorators import api_view
from rest_framework import permissions, generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import *
from .serializers import *
# Create your views here.

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class BudgetUserCreate(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = BudgetUserSerializer

class GroupList(generics.ListCreateAPIView):
    serializer_class = GroupSerializer 
    def get_queryset(self):
        Group.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        Group.save(owner = self.request.user)

class BucketList(generics.ListCreateAPIView):
    serializer_class = BucketSerializer 
    def get_queryset(self):
        Bucket.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        Bucket.save(owner = self.request.user)

class AccountList(generics.ListCreateAPIView):
    serializer_class = AccountSerializer 
    def get_queryset(self):
        Account.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        Account.save(owner = self.request.user)

class MonthlyBudgetList(generics.ListCreateAPIView):
    serializer_class = MonthlyBudgetSerializer 
    def get_queryset(self):
        MonthlyBudget.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        MonthlyBudget.save(owner = self.request.user)

class PayeeList(generics.ListCreateAPIView):
    serializer_class = PayeeSerializer 
    def get_queryset(self):
        Payee.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        Payee.save(owner = self.request.user)

class TransactionList(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer 
    def get_queryset(self):
        Transaction.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        Transaction.save(owner = self.request.user)



