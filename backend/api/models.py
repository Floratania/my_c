# from django.db import models
# from django.contrib.auth.models import User

# class Word(models.Model):
#     text = models.CharField(max_length=100)
#     translation = models.CharField(max_length=100)
#     example = models.TextField(blank=True)

#     def __str__(self):
#         return self.text

# class UserWordProgress(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     word = models.ForeignKey(Word, on_delete=models.CASCADE)
#     is_learned = models.BooleanField(default=False)
#     review_count = models.IntegerField(default=0)
