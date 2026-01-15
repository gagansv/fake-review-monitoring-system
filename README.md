# 🧠🔗 Fake Review Monitoring System  
### AI-Driven, Verifiable & Decentralized Fake Review Detection for E-Commerce

![AI](https://img.shields.io/badge/AI-NLP-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-Polygon-purple)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Overview

Online shopping platforms depend heavily on customer reviews, but **fake and manipulated feedback weakens trust**.  
This project presents an **AI-powered and blockchain-backed system** that detects deceptive reviews and stores verification results on-chain, ensuring **transparency, immutability, and auditability**.

It combines:
- 🧠 **Machine Learning (BERT, DistilBERT, SVM, Logistic Regression)**  
- 🔗 **Blockchain (Polygon, Smart Contracts)**  
- ⚙️ **Full-Stack Web Architecture (React + Node + MongoDB)**  

---

## ✨ Features

✔️ AI-based fake review detection  
✔️ NLP models for semantic understanding  
✔️ Blockchain-secured immutable audit logs  
✔️ Smart contracts for validation  
✔️ SHA-256 hashing for cryptographic integrity  
✔️ REST API for predictions  
✔️ Modular architecture (AI / Backend / Blockchain / Frontend)  
✔️ Trust-building verification mechanism  
✔️ Scalable and extensible system  

---

## 🧱 Tech Stack

| Layer | Technologies |
|------|----------------|
| Frontend | React.js |
| Backend | Node.js, Express |
| Database | MongoDB |
| AI / NLP | Python, BERT, DistilBERT, Scikit-Learn |
| Blockchain | Solidity, Hardhat, Polygon |
| Security | SHA-256 |
| APIs | REST |
| Tools | Git, npm, Python, Hardhat |



---

## 🧠 System Architecture (Workflow)

1. User submits review from frontend  
2. Backend API receives review  
3. Review sent to AI engine  
4. ML models classify as Real/Fake  
5. Prediction result hashed using SHA-256  
6. Hash stored on Polygon using smart contract  
7. Immutable verification created  
8. Result returned to frontend  

---

## 🚀 Step-by-Step Setup Guide

### ✅ Prerequisites

Make sure you have installed:

- Node.js (v16+ recommended)
- npm
- Python (3.8+)
- Git
- MongoDB (local or Atlas)
- Metamask wallet
- Polygon RPC (Alchemy/Infura)

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/gagansv/fake-review-monitoring-system.git
cd fake-review-monitoring-system
```
---

## 2️⃣ Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```
Create a .env file inside the backend/ directory and add the following:
```bash
MONGODB_URI=
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
STORE_WALLET_ADDRESS=
NODE_ENV=development
PORT=5000
```
Run the backend server:
```bash
npm run dev
```
Backend will run on:
```bash
http://localhost:5000
```
---
## 3️⃣ Blockchain Setup

Navigate to the blockchain folder:
```bash
cd blockchain
npm install
```
Create a .env file inside the blockchain/ directory:
```bash
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
STORE_WALLET_ADDRESS=
NODE_ENV=development
PORT=5000
```
Compile smart contracts:
```bash
npx hardhat compile
```
Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network polygon
```
After deployment, copy the deployed contract address and paste it into both:

backend/.env

blockchain/.env

## 4️⃣ AI Engine Setup

Navigate to the AI engine folder:
```bash
cd ai-engine
pip install -r requirements.txt
```
Run the machine learning server:
```bash
uvicorn app:app --reload
```
ML will run on:
```bash
Uvicorn running on http://127.0.0.1:8000
```

## 5️⃣ Frontend Setup

Navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on:
```bash
http://localhost:3000
```

### 📡 Example API Flow

Request:

POST /api/review/check
```bash
{
  "review": "This product is amazing and works perfectly!"
}
```
Response:
```bash
{
  "label": "Genuine",
  "confidence": 0.97,
  "hashStoredOnChain": true
}
```
## 📊 Model Performance

| Model               | Accuracy | F1 Score |
|--------------------|----------|----------|
| Logistic Regression | **96%**  |  **0.95** |
| SVM                | **97%**  |  **0.96** |
| DistilBERT         |**98%**|  **0.97**  |
| **BERT + Blockchain** | **97%** | **0.97** |

## 🔒 Why Blockchain?

✔️ Tamper-proof storage

✔️ Transparent verification

✔️ Immutable audit logs

✔️ Decentralized trust

✔️ Permanent proof of validation

## 🌍 Use Cases

E-commerce platforms

Online marketplaces

Product review systems

App review platforms

Trust and reputation systems

Service feedback platforms

## 👨‍💻 Authors

Manoj Y G

Gagan S V

Shivashankara M B

Priyanka H

