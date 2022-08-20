from rest_framework import serializers
from rest_framework.views import exception_handler
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import BudgetUser, Group, Bucket, MonthlyBudget, Account, Payee, Transaction, Month


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(CustomTokenObtainPairSerializer, cls).get_token(user)
        token['username'] = user.username
        token['display_name'] = user.display_name
        return token

class BudgetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetUser
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')

class BucketSerializer(serializers.ModelSerializer):
     #parent = serializers.StringRelatedField()
    class Meta:
        model = Bucket
        fields = ('id', 'parent', 'name')

class MonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Month
        fields = ('id', 'short_name', 'long_name')
    
class MonthlyBudgetSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(source = 'category.id')
    class Meta:
        model = MonthlyBudget
        fields = ('id', 'month', 'category', 'amount')

    def to_internal_value(self, data):
        return super(MonthlyBudgetSerializer, self).to_internal_value(data)

    def to_representation(self, instance):
        return ReadMonthlyBudgetSerializer(instance).data

class ReadMonthlyBudgetSerializer(serializers.ModelSerializer):
    month = MonthSerializer()
    category = BucketSerializer()
    class Meta(MonthlyBudgetSerializer.Meta):
        pass

class AccountSerializer(serializers.ModelSerializer):
    accountName = serializers.CharField(source='name')
    accountType = serializers.CharField(source='account_type')
    class Meta:
        model = Account
        fields = ('id', 'accountName', 'accountType')

class PayeeSerializer(serializers.ModelSerializer):
    linked_bucket = serializers.StringRelatedField() 
    class Meta:
        model = Payee
        fields = ('id', 'name', 'linked_bucket')

class TransactionSerializer(serializers.ModelSerializer):
    ta_account = serializers.StringRelatedField(source = 'ta_account.name')
    ta_payee = serializers.StringRelatedField(source = 'ta_payee.name')
    ta_bucket = serializers.StringRelatedField(source = 'ta_bucket.name')

    class Meta:
        model = Transaction
        fields = ('ta_date', 'ta_account', 'ta_payee', 'ta_bucket', \
                'note', 'in_amount', 'out_amount', 'cleared', 'reconciled')

class CategorySerializer(serializers.ModelSerializer):
    bucket = BucketSerializer(many=True)

    class Meta:
        model = Group;
        fields = ('id', 'name', 'bucket')

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {}
        custom_response['errors'] = []

        for key, value in response.data.items():
            error = {'field': key, 'message': value}
            custom_response['errors'].append(error)
    response.data = custom_response 
    return response

