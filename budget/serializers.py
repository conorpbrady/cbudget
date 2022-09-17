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
        fields = ('id', 'short_name', 'long_name', 'start_date', 'end_date')

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
    account = serializers.StringRelatedField(source = 'ta_account.name')
    account_id = serializers.StringRelatedField(source ='ta_account.id')
    payee = serializers.StringRelatedField(source = 'ta_payee.name')
    payee_id = serializers.StringRelatedField(source = 'ta_payee.id')
    category = serializers.StringRelatedField(source = 'ta_bucket.name')
    category_id = serializers.StringRelatedField(source = 'ta_bucket.id')

    class Meta:
        model = Transaction
        fields = ('id', 'ta_date', 'account', 'account_id', 'payee', \
                'payee_id', 'category', 'category_id', \
                'note', 'in_amount', 'out_amount', 'cleared', 'reconciled')

class CategorySerializer(serializers.ModelSerializer):
    bucket = BucketSerializer(many=True)

    class Meta:
        model = Group
        fields = ('id', 'name', 'bucket')

class MonthlySumSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(source = 'category__parent')
    amount = serializers.StringRelatedField(source = 'budget_amount')
    month = serializers.StringRelatedField()
    class Meta:
        model = MonthlyBudget
        fields = ('month', 'category', 'amount')

class TransactionSumSerializer(serializers.ModelSerializer):
    amount = serializers.StringRelatedField(source = 'ta_amount')
    category = BucketSerializer(source = 'ta_bucket')
    month = MonthSerializer()

    class Meta:
        model = Transaction
        fields = ('month', 'category', 'amount')

    # Annotating / Grouping by Sum seems to cause Django to return only the FK
    # Getting the model objects here from FK before returning them
    def to_representation(self, instance):
        instance['ta_bucket'] = Bucket.objects.get(id = instance['ta_bucket'])
        instance['month'] = Month.objects.get(id = instance['month'])
        return super().to_representation(instance)

class CumSumSerializer(serializers.Serializer):
    month = MonthSerializer()
    category = BucketSerializer()
    budgetAmount = serializers.DecimalField(decimal_places = 2, max_digits = 11)
    budgetSum = serializers.DecimalField(decimal_places = 2, max_digits = 11)
    transactionAmount = serializers.DecimalField(decimal_places = 2, max_digits = 11)
    transactionSum = serializers.DecimalField(decimal_places = 2, max_digits = 11)
    class Meta:
        fields = ('month', 'category', 'budgetAmount', 'transactionAmount', 'budgetSum', 'transactionSum')

    def to_representation(self, instance):
        instance['month'] = Month.objects.get(id = instance['month'])
        instance['category'] = Bucket.objects.get(id = instance['category'])
        return super().to_representation(instance)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    custom_response = {}
    if response is not None:
        custom_response['errors'] = []

        for key, value in response.data.items():
            error = {'field': key, 'message': value}
            custom_response['errors'].append(error)
        response.data = custom_response
        return response
