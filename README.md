
---

# 📘 **Argo Wellness Assistant – AI-Powered Multi-Agent Digital Wellness Platform**

Empowering students and working professionals with AI-driven wellness support.
Argo Wellness Assistant analyzes user symptoms, provides actionable recommendations, and offers personalized guidance using a multi-agent architecture.

---
## 🚀 Live Links

[![Frontend](https://img.shields.io/badge/Live%20Frontend-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://argo-wellness-assistant-buyx.vercel.app/).


[![Backend](https://img.shields.io/badge/Live%20Backend-Render-blue?style=for-the-badge&logo=render)](https://argo-wellness-assistant.onrender.com).


## 🚀 **Features**

### 🧠 AI-Powered Multi-Agent System

* Symptom Analysis Agent
* Diet Recommendation Agent
* Mental Wellness Agent
* Routine Builder Agent
* Auto-handoff between agents based on intent

### 🎨 Beautiful Client UI (React + Vite)

* Real-time AI conversations
* Modern UI with TailwindCSS
* 3D animations with React Three Fiber
* Code Editor view with Codemirror extensions
* Emoji Picker, Markdown support, Hot Toast notifications

### 🔐 Authentication

* Clerk Authentication for secure login & session management

### ⚡ Real-time Communication

* Socket.io-powered live interactions

### 🧩 Modular Backend Architecture (Flask)

* Config-driven setup
* Clean service layer + utils
* Secure API endpoints
* Integrated with OpenAI / LLM provider
* CORS configured for Vercel frontend

---

## 🏛️ **Tech Stack**

### **Frontend**

* React 18
* Vite
* TailwindCSS
* Framer Motion
* React Three Fiber + Drei
* Clerk Authentication
* Codemirror
* React Router

### **Backend**

* Python Flask
* Flask-CORS
* Gunicorn
* Modular micro-architecture
* OpenAI-compatible LLM integrations

### **Deployment**

* **Frontend** → Vercel
* **Backend** → Render (Gunicorn + Flask)

---

## 📁 **Project Structure**

```
Argo_Wellness_Assistant/
│
├── client/                # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── healthbackend/         # Backend (Flask API)
│   ├── app.py
│   ├── wsgi.py
│   ├── requirements.txt
│   ├── services/
│   ├── utils/
│   └── config/
│
└── README.md
```

---
## Project Architecture
<img width="1078" height="1280" alt="image" src="https://github.com/user-attachments/assets/5d187ff3-cdaa-4a11-91e4-8b1ee0d44594" />

---

## ⚙️ **Backend Setup (Local Development)**

### **1️⃣ Create virtual environment**

```bash
cd healthbackend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### **2️⃣ Install dependencies**

```bash
pip install -r requirements.txt
```

### **3️⃣ Run Flask server**

```bash
python app.py
```

Server will start at:

```
http://localhost:5000
```

---

## 🧪 **Frontend Setup (Local Development)**

### **1️⃣ Install dependencies**

```bash
cd client
npm install
```

### **2️⃣ Start dev server**

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🌐 **Deployment Overview**

### **Frontend (Vercel)**

* Root Directory → `client`
* Build Command → `npm run build`
* Output Directory → `dist`
* Environment variables prefixed with `VITE_`

### **Backend (Render)**

* Use `healthbackend` as root directory
* Start command:

```bash
gunicorn wsgi:app --bind 0.0.0.0:$PORT
```

* Add environment vars in Render dashboard
* Do NOT set a manual PORT

---

## 🔐 **Environment Variables**

### **Frontend (Vite)**

```
VITE_BACKEND_URL = https://your-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY = ...
```

### **Backend (Render)**

```
OPENAI_API_KEY=...
SECRET_KEY=...
ALLOWED_ORIGIN=https://your-frontend.vercel.app
```

---

## 🧭 **API Endpoints (Example)**

| Method | Endpoint   | Description                          |
| ------ | ---------- | ------------------------------------ |
| POST   | `/analyze` | Analyze user symptom text            |
| POST   | `/diet`    | Get personalized diet recommendation |
| POST   | `/routine` | Generate wellness routine            |
| GET    | `/health`  | Health check                         |

---

## 🖼️ **Screenshots (Optional Section)**
<img width="1910" height="967" alt="image" src="https://github.com/user-attachments/assets/f12df000-a542-49a7-8b41-07d5c198b343" />
<img width="1918" height="981" alt="image" src="https://github.com/user-attachments/assets/4f4b45da-c62a-42c7-be68-26c3b6bc62e8" />
<img width="1917" height="915" alt="image" src="https://github.com/user-attachments/assets/744d6c37-0db5-4f8b-b93a-993cf12cc5cb" />
<img width="1918" height="967" alt="image" src="https://github.com/user-attachments/assets/f90f61d3-fb1b-4391-b211-d2b8199bb7f1" />
<img width="1918" height="955" alt="image" src="https://github.com/user-attachments/assets/a8ef335a-c85e-495c-82dc-ae24afbb5d5b" />
<img width="1918" height="972" alt="image" src="https://github.com/user-attachments/assets/ee7ced7c-8cff-45c0-8a3a-7a9d924fb410" />

---

## 🎯 **Future Enhancements**

* Voice-based wellness guidance
* Personalized health dashboards
* Offline mode for recommendations
* Persistent long-term memory agent

---

## ❤️ **Contributing**

Pull requests are welcome!
For major changes, open an issue first.

---

## 📜 **License**

MIT License.

---


Just tell me!
