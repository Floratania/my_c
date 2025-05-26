import torch.nn as nn
from transformers import BertModel

tense_labels = {
    'present simple': 0, 'present continuous': 1, 'present perfect': 2, 'present perfect continuous': 3,
    'past simple': 4, 'past continuous': 5, 'past perfect': 6, 'past perfect continuous': 7,
    'future simple': 8, 'future continuous': 9, 'future perfect': 10, 'future perfect continuous': 11
}

class TenseClassifier(nn.Module):
    def __init__(self, num_classes=12):
        super().__init__()
        self.bert = BertModel.from_pretrained('bert-base-uncased')
        self.fc = nn.Sequential(
            nn.ReLU(),
            nn.Linear(self.bert.config.hidden_size, num_classes)
        )

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids, attention_mask=attention_mask)
        return self.fc(outputs.last_hidden_state[:, 0, :])


