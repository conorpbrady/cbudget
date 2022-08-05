from rest_framework.decorators import api_view
from rest_framework import status, permissions, generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

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
        serializer.save(owner = self.request.user)

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
        ta_account = Account(self.request.data['account'])
        ta_payee = Payee(self.request.data['payee'])
        ta_bucket = Bucket(self.request.data['category'])
        serializer.save(
                owner = self.request.user, 
                ta_account = ta_account, 
                ta_payee = ta_payee, 
                ta_bucket = ta_bucket
                )



