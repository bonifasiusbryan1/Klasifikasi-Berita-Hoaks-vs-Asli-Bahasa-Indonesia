# 📰 Indonesian News Hoax Classifier

<div align="center">

### *A web app + Python API that classifies Indonesian-language news as **real** or **hoax**, with confidence scores.*

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge\&logo=flask\&logoColor=white)](https://flask.palletsprojects.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge\&logo=pytorch\&logoColor=white)](https://pytorch.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge\&logo=scikitlearn\&logoColor=white)](https://scikit-learn.org/)
[![Transformers](https://img.shields.io/badge/Transformers-FFD21E?style=for-the-badge\&logo=huggingface\&logoColor=black)](https://huggingface.co/transformers/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)

</div>

---

## ✨ Overview

> A two-stage Indonesian hoax-news classifier combining **IndoBERT** fine-tuning and an **SVM** head. The UI is built with HTML/Tailwind; inference runs via a **Python API** in `app.py`. The page also displays **probability / confidence** for each prediction.

* **Stage 1 — Deep Learning (IndoBERT):** Freeze the first **6 layers**, train the remaining **6 layers** for **10 epochs**. Grid search on `weight_decay ∈ {0.001, 0.01, 0.1}`, `learning_rate ∈ {5e-6, 1e-5, 2e-5, 3e-5, 5e-5}`, and `batch_size ∈ {16, 32}`.
* **Stage 2 — Machine Learning (SVM):** Grid search on `C ∈ {0.01, 0.1, 1, 10, 100}`, `gamma ∈ {0.001, 0.01, 0.1, 1}`, and `batch_size ∈ {16, 32}`.

**Why this matters.** Indonesia’s rapid shift to digital and social platforms amplifies fast, engagement-driven sharing—often based on headlines alone. Algorithmic feeds can prioritize emotionally charged content over accuracy, increasing exposure to misinformation and eroding trust. This app offers a lightweight way to triage Indonesian news text into *real* vs *hoax*, complete with a confidence score.

### 🎯 Key Features

* 🔎 **Real‑time Classification** — Paste any Indonesian news text and get *Real* / *Hoax* plus **confidence**.
* 🧠 **Two‑Stage Pipeline** — IndoBERT representations + SVM decision boundary.
* ⚙️ **Pretrained Weights** — Load artifacts from `models/hasil_indobert.pt` and `models/hasil_svm.pkl`.
* 🧪 **Reproducible Training** — Clear hyperparameter grids for both stages.
* 💻 **Simple UI + Python API** — Use the browser UI or call predictions programmatically.

---

## 🛠️ Technology Stack

<div align="center">

### Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square\&logo=python\&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square\&logo=flask\&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square\&logo=pytorch\&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square\&logo=scikitlearn\&logoColor=white)
![Transformers](https://img.shields.io/badge/Transformers-FFD21E?style=flat-square\&logo=huggingface\&logoColor=black)

### Frontend / Build

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square\&logo=javascript\&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square\&logo=tailwindcss\&logoColor=white)

</div>

---

## 📸 Application Screenshots

> **Screenshots use example content for demonstration.** Confidence/probability is shown on the result screen.

<details>
<summary>🖼️ <strong>Click to view application interface</strong></summary>

<br>

<div align="center">

### 🏁 Landing Page

<img src="public/Tampilan Awal-1.png" alt="Landing page 1" width="600" />
<img src="public/Tampilan Awal-1.png" alt="Landing page 2" width="600" />

### 🚩 Hoax Prediction Examples

<img src="public/Berita Hoaks-1.png" alt="Hoax example 1" width="600" />
<img src="public/Berita Hoaks-2.png" alt="Hoax example 2" width="600" />

### ✅ Real News Prediction Examples

<img src="public/Berita Asli-1.png" alt="Real example 1" width="600" />
<img src="public/Berita Asli-2.png" alt="Real example 2" width="600" />

</div>

</details>

---

## 🚀 Quick Start Guide

### Prerequisites

* 🐍 **Python 3.10+**
* 📦 **pip** (and optionally a virtual environment)
* 🌐 **Node.js & NPM** (for Tailwind build)

### Installation

```bash
# 📥 Clone the repository
git clone <your-repo-url>
cd <your-repo-folder>

# 🐍 Python environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt

# 🧱 Frontend assets (Tailwind)
npm install
# For development (watch):
npm run dev
# Or build once:
npm run build

# 🤖 Run the app (Flask)
python app.py
```

### 🌐 Access the Application

Open your browser at: `http://127.0.0.1:5000`

> **Note:** `app.py` exposes a Python API for inference and serves the UI. Pretrained weights are loaded from `models/` at startup.

---

## 🧩 Project Structure

```
├── app.py 
├── models/ 
│   ├── hasil_indobert.pt 
│   └── hasil_svm.pkl 
├── public/
│   ├── Tampilan Awal-1.png
│   ├── Tampilan Awal-1.png
│   ├── Berita Hoaks-1.png
│   ├── Berita Hoaks-2.png
│   ├── Berita Asli-1.png
│   └── Berita Asli-2.png
├── static/ 
│   ├── css/ 
│   │   ├── input.css 
│   │   ├── output.css 
│   │   └── custom.css 
│   └── js/ 
│       └── script.js 
├── templates/ 
│   └── index.html 
├── package.json 
├── tailwind.config.js 
├── postcss.config.js 
└── node_modules/
```

---

## 🧠 Modeling Details

* **IndoBERT fine‑tuning** with partial layer freezing (6 frozen / 6 trainable), 10 epochs.
* **Hyperparameters:**

  * *IndoBERT:* `weight_decay = {0.001, 0.01, 0.1}`, `learning_rate = {5e-6, 1e-5, 2e-5, 3e-5, 5e-5}`, `batch_size = {16, 32}`.
  * *SVM:* `C = {0.01, 0.1, 1, 10, 100}`, `gamma = {0.001, 0.01, 0.1, 1}`, `batch_size = {16, 32}`.
* **Outputs:** `label ∈ {"real", "hoax"}` and a **confidence probability** in `[0,1]`.

---

## 🙌 Acknowledgements

Indonesian NLP community and open‑source contributors behind IndoBERT, Transformers, PyTorch, and scikit‑learn.
