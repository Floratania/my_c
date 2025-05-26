# leveltest/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from leveltest.models import LevelQuestion, UserAnswer, LevelTestResult
from leveltest.serializers import LevelQuestionSerializer
from collections import defaultdict
from .utils.ai_generator import generate_ai_questions
from .utils.final_level import calculate_final_level
from .utils.adaptive_test import next_level, prev_level

import random

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
        type_errors = defaultdict(int)

        for item in data:
            q = LevelQuestion.objects.get(id=item['question_id'])
            is_correct = q.correct.lower() == item['selected'].lower()
            level_scores[q.level]['total'] += 1
            if is_correct:
                level_scores[q.level]['correct'] += 1
            else:
                type_errors[q.type] += 1

            UserAnswer.objects.create(
                user=user,
                question=q,
                selected=item['selected'],
                is_correct=is_correct
            )

        level_percent = {}
        for lvl, score in level_scores.items():
            percent = round((score['correct'] / score['total']) * 100, 2)
            level_percent[lvl] = percent

        avg_score = round(
            sum(s['correct'] for s in level_scores.values()) / 
            sum(s['total'] for s in level_scores.values()) * 100, 2
        )

        # ✨ Нове — обчислення рівня через calculate_final_level
        level_info = calculate_final_level(
            level_percent=level_percent,
            type_errors=type_errors
        )
        result_level = level_info['adjusted_level']

        LevelTestResult.objects.create(
            user=user,
            level=result_level,
            score=avg_score
        )

        return Response({
            'level': result_level,
            'score': avg_score,
            'details': level_percent,
            'type_errors': type_errors,
            'base_level': level_info['base_level'],
            'ai_score': None,
            'explanation': level_info['reason']
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_ai(request):
    level = request.GET.get('level', 'B1')
    try:
        print("🔍 Generating AI questions for level:", level)
        questions = generate_ai_questions(level, count=10)
        return Response({'questions': questions})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_adaptive_questions(request):
    level = request.GET.get('level', 'B1')
    count = int(request.GET.get('count', 5))
    qs = LevelQuestion.objects.filter(level=level).order_by('?')[:count]
    return Response(LevelQuestionSerializer(qs, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adjust_level(request):
    """
    Приймає:
    - base_level
    - ai_score
    - type_errors
    - level_percent
    І повертає скоригований рівень
    """
    user = request.user
    data = request.data

    level_info = calculate_final_level(
        level_percent=data.get('level_percent', {}),
        type_errors=data.get('type_errors', {}),
        ai_score=data.get('ai_score')
    )

    adjusted = level_info['adjusted_level']

    LevelTestResult.objects.create(
        user=user,
        level=adjusted,
        score=data.get('ai_score', 0)
    )

    return Response({
        'level': adjusted,
        'base_level': level_info['base_level'],
        'ai_score': level_info['ai_score'],
        'explanation': level_info['reason']
    })
