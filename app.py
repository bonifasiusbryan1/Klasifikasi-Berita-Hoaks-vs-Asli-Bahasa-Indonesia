import re
import torch
import pickle
import numpy as np
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import AutoTokenizer, AutoConfig, AutoModel
from scipy.special import expit  # Import fungsi sigmoid dari scipy

app = Flask(__name__)
CORS(app)

MODEL_NAME = 'indobenchmark/indobert-base-p1'
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class IndoBERTClassifier(torch.nn.Module):
    def __init__(self, model_name):
        super(IndoBERTClassifier, self).__init__()
        config = AutoConfig.from_pretrained(model_name)
        config.hidden_act = "gelu_new"
        self.bert = AutoModel.from_pretrained(model_name, config=config)
        self.dropout = torch.nn.Dropout(0.3)
        self.classifier = torch.nn.Linear(self.bert.config.hidden_size, 1)

    def forward(self, input_ids, attention_mask, token_type_ids):
        outputs = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids
        )
        pooled_output = outputs[1]
        x = self.dropout(pooled_output)
        logits = self.classifier(x)
        return logits

print("Loading IndoBERT model...")
indobert_model = IndoBERTClassifier(MODEL_NAME)
indobert_model.load_state_dict(torch.load('models/hasil_indobert.pt', map_location=device))
indobert_model.to(device)
indobert_model.eval()

print("Loading SVM model...")
with open('models/hasil_svm.pkl', 'rb') as f:
    svm_info = pickle.load(f)
svm_model = svm_info['model']

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

def preprocessing_text(text):
    text = text.lower()
    text = text.replace('\n', ' ')
    text = re.sub(r'[^0-9a-z\s\.\,\!\?\(\)"“”]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

class TextIntoToken(torch.utils.data.Dataset):
    def __init__(self, texts, tokenizer, max_length=256):
        self.texts = texts
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            truncation=True,
            padding='max_length',
            return_token_type_ids=True,
            return_attention_mask=True,
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'token_type_ids': encoding['token_type_ids'].flatten(),
        }

def extract_cls_features(texts, batch_size=32):
    dataset = TextIntoToken(texts, tokenizer)
    dataloader = torch.utils.data.DataLoader(dataset, batch_size=batch_size, shuffle=False)
    
    features = []
    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            token_type_ids = batch['token_type_ids'].to(device)

            outputs = indobert_model.bert(
                input_ids=input_ids,
                attention_mask=attention_mask,
                token_type_ids=token_type_ids,
                output_hidden_states=True,
                return_dict=True
            )
            
            last_hidden = outputs.hidden_states[-1]
            cls_hidden = last_hidden[:, 0, :]
            
            features.append(cls_hidden.cpu().numpy())
    
    return np.vstack(features)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        text = data['text']
        
        processed_text = preprocessing_text(text)
        
        features = extract_cls_features([processed_text])
        
        prediction = svm_model.predict(features)[0]
        
        if hasattr(svm_model, "predict_proba"):
            confidence = np.max(svm_model.predict_proba(features))
        else:
            decision_value = svm_model.decision_function(features)[0]

            confidence = expit(decision_value)
            
            if prediction == 0:
                confidence = 1 - confidence
        
        result = {
            'prediction': int(prediction),
            'confidence': float(confidence),
            'label': 'Asli' if prediction == 1 else 'Hoax',
            'text_preprocessed': processed_text
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)