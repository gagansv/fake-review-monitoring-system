from transformers import BertTokenizer, BertForSequenceClassification
import torch

MODEL_PATH = "./bert_fake_review_model"

tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

def predict(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.softmax(outputs.logits, dim=1)[0]
    return {
        "genuine_prob": round(probs[0].item(), 3),
        "fake_prob": round(probs[1].item(), 3)
    }

# ---- TEST CASES ----
tests = [
    "This product is amazing, totally changed my life!",
    "Worst product ever. Do not buy.",
    "The delivery was on time and quality is okay.",
    "Best product best product best product buy now!"
]

for t in tests:
    print("\nReview:", t)
    print(predict(t))
