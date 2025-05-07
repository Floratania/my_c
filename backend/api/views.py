from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated



# class RegisterView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         if not username or not password:
#             return Response({'error': 'Username and password required'}, status=400)

#         if User.objects.filter(username=username).exists():
#             return Response({'error': 'User already exists'}, status=400)

#         User.objects.create_user(username=username, password=password)
#         return Response({'message': 'User created'}, status=201)
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        phone = request.data.get('phone')
        birth_date = request.data.get('birth_date')
        gender = request.data.get('gender')

        if not username or not password:
            return Response({'error': 'Username and password required'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'User already exists'}, status=400)

        user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name = last_name, email=email)
        # user.profile.email = email
        user.profile.phone = phone
        user.profile.birth_date = birth_date
        user.profile.gender = gender
        user.profile.save()

        return Response({'message': 'User created'}, status=201)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid credentials'}, status=401)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    return Response({
        'username': request.user.username
    })