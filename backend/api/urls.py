from django.urls import path
from .views import HelloWorld, LoginView

urlpatterns = [
    path('hello/', HelloWorld.as_view()),
    path('login/', LoginView.as_view()),
]