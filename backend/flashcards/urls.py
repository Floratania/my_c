# from django.urls import path
# from .views import FlashcardViewSet, WordSetViewSet, UserFlashcardProgressViewSet

# urlpatterns = [
#     path('flashcards/', FlashcardViewSet.as_view(), name='flashcards'),
#     path('sets/', WordSetViewSet.as_view(), name='mark_learned'),
#     path('progress/', UserFlashcardProgressViewSet.as_view(), name=''),
# ]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FlashcardViewSet, WordSetViewSet, UserFlashcardProgressViewSet

router = DefaultRouter()
router.register(r'flashcards', FlashcardViewSet, basename='flashcards')
router.register(r'wordsets', WordSetViewSet, basename='wordsets')
router.register(r'progress', UserFlashcardProgressViewSet, basename='progress')
# router.register(r'wordsets', WordSetViewSet, basename='wordsets')  # ← це basename


urlpatterns = [
    path('', include(router.urls)),
]
