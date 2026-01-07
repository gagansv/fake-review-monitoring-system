from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# ---------------- App ----------------
app = FastAPI(
    title="Fake Review Detection API",
    description="Detects fake reviews using a trained DistilBERT model",
    version="1.0"
)

# ---------------- Device ----------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------- Load Model ----------------
MODEL_PATH = "./fake_review_model"   # folder containing config.json

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.to(device)
model.eval()

# ---------------- Request Schema ----------------
class ReviewRequest(BaseModel):
    review: str

# ---------------- API Endpoint ----------------
@app.post("/analyze")
def analyze_review(data: ReviewRequest):

    # Tokenize input
    inputs = tokenizer(
        data.review,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256
    )

    # Move tensors to CPU/GPU
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Inference
    with torch.no_grad():
        outputs = model(**inputs)

    # Softmax probabilities
    probs = torch.softmax(outputs.logits, dim=1)[0]

    # Label mapping (VERY IMPORTANT)
    # 0 → genuine
    # 1 → fake
    genuine_prob = probs[0].item()
    fake_prob = probs[1].item()

    # Threshold-based decision
    label = "fake" if fake_prob >= 0.6 else "genuine"

    return {
        "genuine_probability": round(genuine_prob, 3),
        "fake_probability": round(fake_prob, 3),
        "label": label,
        "trust_score": round(genuine_prob, 2)
    }
