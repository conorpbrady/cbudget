from rest_framework import serializers
from .models import Group, Bucket, MonthlyBudget, Account, Payee, Transaction

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class BucketSerializer(serializers.ModelSerializer):
    parent = serializers.StringRelatedField(many=True)
    class Meta:
        model = Bucket
        fields = ('parent', 'name')

class MonthlyBudgetSerializer(serializers.ModelSerializer):
    bucket = serializers.StringRelatedField(many=True)
    class Meta:
        model = MonthlyBudget
        fields = ('month', 'bucket', 'amount')

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('name', 'account_type')

class PayeeSerializer(serializers.ModelSerializer):
    linked_bucket = serializers.StringRelatedField(many=True) 
    class Meta:
        model = Payee
        fields = ('name', 'linked_bucket')

class TransactionSerializer(serializers.ModelSerializer):
    ta_account = serializers.StringRelatedField(many=True)
    ta_payee = serializers.StringRelatedField(many=True)
    ta_bucket = serializers.StringRelatedField(many=True)
    class Meta:
        model = Transaction
        fields = ('ta_date', 'ta_account', 'ta_payee', 'ta_bucket', \
                'note', 'in_amount', 'out_amount', 'cleared', 'reconciled')
