from rest_framework import serializers
from .models import BaseQuestion

class BaseQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseQuestion
        fields = '__all__'
