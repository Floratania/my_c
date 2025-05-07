from django.shortcuts import render
from .models import BaseQuestion
from .serializers import BaseQuestionSerializer
from rest_framework.response import Response


class MixedLevelTestView(APIView):
    def get(self, request):
        # Pick 3 questions of each type
        types = ['grammar', 'idiom', 'phrasal', 'listening']
        result = []

        for q_type in types:
            questions = BaseQuestion.objects.filter(type=q_type).order_by('?')[:3]
            result.extend(BaseQuestionSerializer(questions, many=True).data)

        return Response(result)

    def post(self, request):
        # Receive answers and calculate score
        data = request.data.get('answers', [])
        correct = 0
        total = len(data)

        for item in data:
            q = BaseQuestion.objects.filter(id=item['id']).first()
            if q and q.correct_answer == item['answer']:
                correct += 1

        # Decision logic
        percentage = correct / total * 100
        if percentage > 85:
            level = "C1"
        elif percentage > 70:
            level = "B2"
        elif percentage > 50:
            level = "B1"
        elif percentage > 30:
            level = "A2"
        else:
            level = "A1"

        return Response({
            "score": f"{correct}/{total}",
            "estimated_level": level
        })
