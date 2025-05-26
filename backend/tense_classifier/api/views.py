# # tense_classifier/api/views.py
# import torch
# from transformers import BertTokenizer
# from django.conf import settings
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .model import TenseClassifier, tense_labels

# # Load model and tokenizer
# model_path = settings.BASE_DIR / "tense_classifier/model/tense_classifier_model.pth"
# tokenizer_path = settings.BASE_DIR / "tense_classifier/model/tokenizer"
# tokenizer = BertTokenizer.from_pretrained(tokenizer_path)

# model = TenseClassifier(num_classes=len(tense_labels))
# model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
# model.eval()

# @api_view(['POST'])
# def predict_tense(request):
#     sentence = request.data.get("sentence", "").strip()
#     if not sentence:
#         return Response({"error": "Sentence is required"}, status=status.HTTP_400_BAD_REQUEST)

#     inputs = tokenizer(sentence, return_tensors="pt", padding=True, truncation=True)
#     with torch.no_grad():
#         logits = model(inputs['input_ids'], inputs['attention_mask'])
#         predicted_label = torch.argmax(logits, dim=1).item()
    
#     predicted_tense = [k for k, v in tense_labels.items() if v == predicted_label][0]
#     return Response({"tense": predicted_tense})
# tense_classifier/api/views.py
import torch
from transformers import BertTokenizer
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .model import TenseClassifier, tense_labels
from pathlib import Path


# Load model and tokenizer
base_dir = Path(settings.BASE_DIR)  # Перетворення в Path

model_path = base_dir / "tense_classifier/model/tense_classifier_model.pth"
tokenizer_path = base_dir / "tense_classifier/model/tokenizer"

tokenizer = BertTokenizer.from_pretrained(tokenizer_path)

model = TenseClassifier(num_classes=len(tense_labels))
model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
model.eval()

@api_view(['POST'])
def predict_tense(request):
    sentence = request.data.get("sentence", "").strip()
    if not sentence:
        return Response({"error": "Sentence is required"}, status=status.HTTP_400_BAD_REQUEST)

    inputs = tokenizer(sentence, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        logits = model(inputs['input_ids'], inputs['attention_mask'])
        predicted_label = torch.argmax(logits, dim=1).item()
    
    predicted_tense = [k for k, v in tense_labels.items() if v == predicted_label][0]
    return Response({"tense": predicted_tense})
