from django.db import models

class BaseQuestion(models.Model):
    TYPE_CHOICES = [
        ('grammar', 'Grammar'),
        ('listening', 'Listening'),
        ('idiom', 'Idiom'),
        ('phrasal', 'Phrasal Verb'),
        ('ai', 'AI Generated'),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    level = models.CharField(max_length=10, choices=[('A1', 'A1'), ('A2', 'A2'), ('B1', 'B1'), ('B2', 'B2'), ('C1', 'C1')])
    question = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=1)  # 'a', 'b', 'c', 'd'

class AudioQuestion(BaseQuestion):
    audio_file = models.FileField(upload_to='leveltest/audio/', null=True, blank=True)


class UserLevelResult(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    estimated_level = models.CharField(max_length=10)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
