# leveltest/urls.py
from django.urls import path
from .views import LevelTestView, generate_ai, adjust_level,  get_adaptive_questions

urlpatterns = [
    path('leveltest/', LevelTestView.as_view(), name='level-test'),
    path('ai_generate/', generate_ai, name='ai-generate'),
    path('adjust_level/', adjust_level),
    path('adaptive/', get_adaptive_questions),
    
]
