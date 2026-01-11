from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import pickle
import numpy as np
from scipy.special import expit

app = FastAPI(
    title="Fake Review Detection API",
    description="BERT + SVM Ensemble for Fake Review Detection",
    version="2.0"
)

# ============================
# PATHS
# ============================
BERT_PATH = "./bert_fake_review_model"

SVM_PATH = "./svm_model_files/svm_model.pkl"
TFIDF_WORD_PATH = "./svm_model_files/tfidf_word.pkl"
TFIDF_CHAR_PATH = "./svm_model_files/tfidf_char.pkl"

# ============================
# DEVICE
# ============================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ============================
# LOAD BERT
# ============================
print("Loading BERT...")
tokenizer = BertTokenizer.from_pretrained(BERT_PATH)
bert_model = BertForSequenceClassification.from_pretrained(BERT_PATH)
bert_model.to(device)
bert_model.eval()

# ============================
# LOAD SVM + TFIDF
# ============================
print("Loading SVM + TFIDF...")
with open(SVM_PATH, "rb") as f:
    svm_model = pickle.load(f)

with open(TFIDF_WORD_PATH, "rb") as f:
    tfidf_word = pickle.load(f)

with open(TFIDF_CHAR_PATH, "rb") as f:
    tfidf_char = pickle.load(f)

# ============================
# REQUEST SCHEMA
# ============================
class ReviewRequest(BaseModel):
    review: str

# ============================
# BERT PREDICT
# ============================
def bert_predict(text: str):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = bert_model(**inputs)

    probs = torch.softmax(outputs.logits, dim=1)[0].cpu().numpy()

    # index 0 → genuine
    # index 1 → fake
    return probs


# ============================
# SVM PREDICT
# ============================
def svm_predict(text: str):
    word_features = tfidf_word.transform([text])
    char_features = tfidf_char.transform([text])

    combined = np.hstack([
        word_features.toarray(),
        char_features.toarray()
    ])

    score = svm_model.decision_function(combined)[0]

    fake_prob = expit(score)
    genuine_prob = 1 - fake_prob

    return np.array([genuine_prob, fake_prob])


# ============================
# API ENDPOINT
# ============================
@app.post("/analyze")
def analyze_review(data: ReviewRequest):

    bert_probs = bert_predict(data.review)   # expected [genuine, fake]
    svm_probs = svm_predict(data.review)     # expected [genuine, fake]

    # Explicit unpacking
    bert_genuine, bert_fake = float(bert_probs[1]), float(bert_probs[0])
    svm_genuine, svm_fake = float(svm_probs[0]), float(svm_probs[1])

    # Correct averaging
    final_genuine = (bert_genuine + svm_genuine) / 2
    final_fake = (bert_fake + svm_fake) / 2

    label = "fake" if final_fake > final_genuine else "genuine"

    return {
        "label": label,

        "bert_genuine": round(bert_genuine, 4),
        "svm_genuine": round(svm_genuine, 4),
        "final_genuine": round(final_genuine, 4),
        "bert_fake": round(bert_fake, 4),
        "svm_fake": round(svm_fake, 4),
        "final_fake": round(final_fake, 4),

        "trust_score": round(final_genuine, 3)
    }
