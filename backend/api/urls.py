from django.urls import path
from .views import RegisterView, LoginView, profile_view

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', profile_view),
]
