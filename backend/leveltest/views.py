# from django.shortcuts import render
# from .models import BaseQuestion
# from .serializers import BaseQuestionSerializer
# from rest_framework.response import Response


# class MixedLevelTestView(APIView):
#     def get(self, request):
#         # Pick 3 questions of each type
#         types = ['grammar', 'idiom', 'phrasal', 'listening']
#         result = []

#         for q_type in types:
#             questions = BaseQuestion.objects.filter(type=q_type).order_by('?')[:3]
#             result.extend(BaseQuestionSerializer(questions, many=True).data)

#         return Response(result)

#     def post(self, request):
#         # Receive answers and calculate score
#         data = request.data.get('answers', [])
#         correct = 0
#         total = len(data)

#         for item in data:
#             q = BaseQuestion.objects.filter(id=item['id']).first()
#             if q and q.correct_answer == item['answer']:
#                 correct += 1

#         # Decision logic
#         percentage = correct / total * 100
#         if percentage > 85:
#             level = "C1"
#         elif percentage > 70:
#             level = "B2"
#         elif percentage > 50:
#             level = "B1"
#         elif percentage > 30:
#             level = "A2"
#         else:
#             level = "A1"

#         return Response({
#             "score": f"{correct}/{total}",
#             "estimated_level": level
#         })

# leveltest/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .models import LevelQuestion
# from .serializers import LevelQuestionSerializer
# from django.db.models import Count
# import random

# class MixedLevelTestView(APIView):
#     def get(self, request):
#         types = ['grammar', 'idiom', 'phrasal', 'listening']
#         result = []

#         for t in types:
#             sample = LevelQuestion.objects.filter(type=t).order_by('?')[:3]
#             result.extend(LevelQuestionSerializer(sample, many=True).data)

#         random.shuffle(result)
#         return Response(result)
# leveltest/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from leveltest.models import LevelQuestion, UserAnswer, LevelTestResult
# from leveltest.serializers import LevelQuestionSerializer
# from django.db.models import Count
# import random

# class LevelTestView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         questions = []
#         for t in ['grammar', 'idiom', 'phrasal', 'listening']:
#             sample = LevelQuestion.objects.filter(type=t).order_by('?')[:3]
#             questions.extend(sample)

#         random.shuffle(questions)
#         return Response(LevelQuestionSerializer(questions, many=True).data)

#     def post(self, request):
#         data = request.data  # format: [{question_id, selected}]
#         user = request.user
#         correct = 0

#         for item in data:
#             q = LevelQuestion.objects.get(id=item['question_id'])
#             is_correct = q.correct.lower() == item['selected'].lower()
#             if is_correct:
#                 correct += 1

#             UserAnswer.objects.create(
#                 user=user,
#                 question=q,
#                 selected=item['selected'],
#                 is_correct=is_correct
#             )

#         score = round((correct / len(data)) * 100, 2)

#         # determine level (basic logic)
#         if score >= 90:
#             level = 'C1'
#         elif score >= 75:
#             level = 'B2'
#         elif score >= 60:
#             level = 'B1'
#         elif score >= 45:
#             level = 'A2'
#         else:
#             level = 'A1'

#         LevelTestResult.objects.create(
#             user=user,
#             level=level,
#             score=score
#         )

#         return Response({'score': score, 'level': level})
# leveltest/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from leveltest.models import LevelQuestion, UserAnswer, LevelTestResult
from leveltest.serializers import LevelQuestionSerializer
from django.db.models import Q
from collections import defaultdict
import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils.ai_generator import generate_ai_questions
from .utils.determine_level import determine_user_level


class LevelTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        questions = []
        for t in ['grammar', 'idiom', 'phrasal', 'listening']:
            sample = LevelQuestion.objects.filter(type=t).order_by('?')[:3]
            questions.extend(sample)

        random.shuffle(questions)
        return Response(LevelQuestionSerializer(questions, many=True).data)

    def post(self, request):
        data = request.data  # [{question_id, selected}]
        user = request.user
        level_scores = defaultdict(lambda: {'correct': 0, 'total': 0})

        for item in data:
            q = LevelQuestion.objects.get(id=item['question_id'])
            is_correct = q.correct.lower() == item['selected'].lower()
            level_scores[q.level]['total'] += 1
            if is_correct:
                level_scores[q.level]['correct'] += 1

            UserAnswer.objects.create(
                user=user,
                question=q,
                selected=item['selected'],
                is_correct=is_correct
            )

        # Розрахунок відсотків
        level_percent = {}
        for lvl, score in level_scores.items():
            percent = round((score['correct'] / score['total']) * 100, 2)
            level_percent[lvl] = percent

        # Визначення максимального рівня за логікою
        ordered = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
        # result_level = 'A1'
        # for i, lvl in enumerate(ordered):
        #     if level_percent.get(lvl, 0) >= 60:
        #         # всі попередні також ≥ 60%
        #         if all(level_percent.get(prev, 0) >= 60 for prev in ordered[:i]):
        #             result_level = lvl

        result_level = determine_user_level(level_percent)
        avg_score = round(
            sum(s['correct'] for s in level_scores.values()) /
            sum(s['total'] for s in level_scores.values()) * 100, 2
        )

        LevelTestResult.objects.create(
            user=user,
            level=result_level,
            score=avg_score
        )

        return Response({
            'level': result_level,
            'score': avg_score,
            'details': level_percent
        })


# @api_view(['GET'])
# def generate_ai(request):

#     level = request.GET.get('level', 'B1')
#     print("🔍 Generating AI questions for level:", level)
#     try:
#         questions = generate_ai_questions(level)
#         return Response({'questions': questions})
#     except Exception as e:
#         return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def generate_ai(request):
    level = request.GET.get('level', 'B1')
    try:
        print("🔍 Generating AI questions for level:", level)
        questions = generate_ai_questions(level)
        return Response({'questions': questions})
    except Exception as e:
        return Response({'error': str(e)}, status=500)