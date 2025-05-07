from rest_framework import viewsets, permissions
from .models import Flashcard, WordSet, UserFlashcardProgress, UserWordSet
from .serializers import FlashcardSerializer, WordSetSerializer, UserFlashcardProgressSerializer, UserWordSetSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from .utils.importer import import_words_from_file, FILE_SOURCES
from django.db.models import Q, Subquery
from rest_framework.parsers import MultiPartParser
import tempfile
import os



class WordSetViewSet(viewsets.ModelViewSet):
    serializer_class = WordSetSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    # # def get_queryset(self):
    # #     # return WordSet.objects.filter(Q(is_public=True) | Q(owner=self.request.user))
    # #     return WordSet.objects.all()


    # def get_queryset(self):
    #     subscribed_ids = UserWordSet.objects.filter(user=self.request.user).values_list('wordset_id', flat=True)
    #     return WordSet.objects.filter(Q(is_public=True) | Q(owner=self.request.user)).exclude(id__in=subscribed_ids)
    def get_queryset(self):
        subscribed_ids = UserWordSet.objects.filter(
            user=self.request.user
        ).values_list('wordset_id', flat=True)
        
        return WordSet.objects.filter(
            Q(is_public=True) | Q(owner=self.request.user)
        ).exclude(id__in=subscribed_ids)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def subscribe(self, request, pk=None):
        wordset = self.get_object()
        UserWordSet.objects.get_or_create(user=request.user, wordset=wordset)
        return Response({'status': f'Subscribed to {wordset.name}'})

    @action(detail=False, methods=['post'])
    def import_from_file(self, request):
        list_type = request.data.get('list_type')
        if list_type not in FILE_SOURCES:
            return Response({'error': 'Invalid list type'}, status=400)

        filename = FILE_SOURCES[list_type]
        try:
            count, set_id = import_words_from_file(filename, list_type.upper(), request.user)
        except FileNotFoundError:
            return Response({'error': 'File not found'}, status=404)

        return Response({
            'status': 'success',
            'imported': count,
            'set_id': set_id,
        })
        
        
        @action(detail=False, methods=['post'])
        def import_custom(self, request):
            uploaded_file = request.FILES.get('file')
            if not uploaded_file:
                return Response({'error': 'Файл не надано'}, status=400)

            if not uploaded_file.name.endswith('.txt'):
                return Response({'error': 'Потрібен .txt файл'}, status=400)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.txt') as tmp:
                for chunk in uploaded_file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name

            try:
                wordset_name = f"Custom - {request.user.username} - {uploaded_file.name}"
                count, set_id = import_words_from_file(
                    filename=os.path.basename(tmp_path),
                    wordset_name=wordset_name,
                    user=request.user,
                    file_dir=os.path.dirname(tmp_path)
                )
            finally:
                os.remove(tmp_path)

            return Response({
                'status': 'success',
                'imported': count,
                'set_id': set_id,
            })
        
        


class FlashcardViewSet(viewsets.ModelViewSet):
    serializer_class = FlashcardSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        selected_sets = UserWordSet.objects.filter(user=self.request.user).values_list('wordset_id', flat=True)

        # 🔽 NEW: фільтрація по набору
        set_filter = self.request.query_params.get('set')
        if set_filter:
            selected_sets = selected_sets.filter(id=set_filter)

        queryset = Flashcard.objects.filter(set__id__in=Subquery(selected_sets))

        # 🔽 залишаємо фільтрацію за статусом
        status_filters = self.request.query_params.getlist('status')
        if status_filters:
            exclude_ids = UserFlashcardProgress.objects.filter(
                user=self.request.user
            ).exclude(status__in=status_filters).values_list('flashcard_id', flat=True)
            queryset = queryset.exclude(id__in=exclude_ids)
        else:
            exclude_ids = UserFlashcardProgress.objects.filter(
                user=self.request.user
            ).values_list('flashcard_id', flat=True)
            queryset = queryset.exclude(id__in=exclude_ids)

        return queryset.order_by('?')



class UserFlashcardProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserFlashcardProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserFlashcardProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
