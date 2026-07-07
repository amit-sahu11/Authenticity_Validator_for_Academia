# 🎓 Authenticity Validator for Academia

A full-stack academic credential verification platform that enables universities to register certificates on a secure ledger and allows recruiters to validate candidate credentials — with both a **simulated (offline) mode** and a **backend (database-backed) mode**.

![GitHub repo size](https://img.shields.io/github/repo-size/amit-sahu11/Authenticity_Validator_for_Academia)
![GitHub last commit](https://img.shields.io/github/last-commit/amit-sahu11/Authenticity_Validator_for_Academia)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Operation Modes](#-operation-modes)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. OCR Service Setup](#2-ocr-service-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Verification Workflow](#-verification-workflow)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

- 🏛️ **University Portal** — Upload and register student certificates onto a secure ledger
- 🔍 **Recruiter Dashboard** — Verify candidate credentials via manual entry or OCR-based image scan
- 🤖 **OCR Certificate Scanning** — Automatically extract student details from uploaded certificate images using Tesseract OCR (with Google Cloud Vision fallback)
- 🔐 **JWT Authentication** — Role-based access control for `university` and `recruiter` roles
- 📊 **Rich Dashboard** — Candidates, Reports, Universities, and Activity Log pages
- ⚡ **Simulated Mode** — Fully offline demo mode using browser `localStorage` — no backend needed
- 🔗 **Fuzzy Matching Engine** — SHA-256 hashed ledger entries with similarity scoring for partial-match detection

---

## 🏗️ System Architecture

```
       +-----------------------+
       |   React (Vite) UI     | <---+
       |   (Port: 5173)        |     | Settings-driven toggle
       +-----------+-----------+     | between mock & real APIs
                   |                 |
         Backend Mode Requests       |
                   v                 |
       +-----------------------+     |
       |  Express Gateway API  | <---+
       |   (Port: 5000)        |
       +-----+-----------+-----+
             |           |
             |           +-----------------------+
             v                                   v
+------------+------------+            +---------+-------------+
|    MongoDB Database     |            |  Python Flask OCR     |
| (localhost:27017/auth)  |            |  Service (Port: 5001) |
+-------------------------+            +-----------------------+
```

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Frontend     | React 18, Vite, CSS Grid/Flexbox        |
| Backend      | Node.js, Express.js, Mongoose, JWT      |
| Database     | MongoDB                                 |
| OCR Service  | Python, Flask, pytesseract, Pillow      |
| Auth         | JWT (JSON Web Tokens), bcrypt           |
| Hashing      | SHA-256 (Node.js `crypto` module)       |

---

## 🔄 Operation Modes

### ⚡ Simulated Mode *(Default — no setup required)*
- Pure client-side environment — no backend or database needed
- Ledger stored in browser `localStorage`
- Switch between `university` and `recruiter` roles instantly from Settings
- Great for: demo presentations, UI testing, and local development

### 🗄️ Backend Mode *(Full-stack)*
- Full integration with MongoDB, Express API, and OCR microservice
- Real JWT authentication with registration and login flows
- Verified credentials persisted to the database
- Great for: production deployment and end-to-end testing

> Toggle between modes from the **Settings** panel in the dashboard.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`
- [Python 3.x](https://www.python.org/)
- [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki) *(optional — fallback mock available)*

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/authenticity_validator
JWT_SECRET=your_super_secret_key_min_32_chars_long_change_this_in_production
JWT_EXPIRE=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=5000
NODE_ENV=development
```

Start the server:

```bash
node server.js
```

The API will be live at `http://localhost:5000`.

---

### 2. OCR Service Setup

```bash
cd ocr-service

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install flask pytesseract Pillow

# Start the OCR service
python app.py
```

The OCR service will be live at `http://localhost:5001`.

> **Note:** If Tesseract is not installed, the service falls back to mock output automatically.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

### ✅ Combined Startup Checklist (Backend Mode)

1. ☐ Ensure MongoDB is running locally
2. ☐ Start backend: `cd backend && node server.js`
3. ☐ Start OCR service: `cd ocr-service && venv\Scripts\activate && python app.py`
4. ☐ Start frontend: `cd frontend && npm run dev`
5. ☐ Open `http://localhost:5173` and switch to **Backend Mode** in Settings

---

## 🔐 Environment Variables

| Variable          | Description                            | Default                          |
|-------------------|----------------------------------------|----------------------------------|
| `MONGODB_URI`     | MongoDB connection string              | `mongodb://127.0.0.1:27017/...`  |
| `JWT_SECRET`      | Secret key for JWT signing             | *(required)*                     |
| `JWT_EXPIRE`      | JWT token expiration duration          | `7d`                             |
| `ALLOWED_ORIGINS` | CORS-allowed frontend origins          | `http://localhost:5173`          |
| `PORT`            | Express server port                    | `5000`                           |
| `NODE_ENV`        | Node environment                       | `development`                    |

---

## 📁 Project Structure

```
Authenticity_Validator_for_Academia/
│
├── backend/                    # Node.js / Express REST API
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT authentication & RBAC
│   ├── models/
│   │   ├── Certificate.js      # Certificate schema
│   │   └── User.js             # User schema
│   ├── routes/
│   │   ├── recruiterRoutes.js  # Recruiter verification endpoints
│   │   ├── universityRoutes.js # University upload endpoints
│   │   └── userRoutes.js       # Auth endpoints
│   ├── utils/
│   │   ├── fileUpload.js       # Multer file handling
│   │   ├── hashPassword.js     # bcrypt helpers
│   │   ├── jwt.js              # Token generation/verification
│   │   ├── matching.js         # Fuzzy matching engine
│   │   └── ocrProcessor.js     # OCR pipeline (Vision → Flask → mock)
│   └── server.js               # Entry point
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/layout/  # Sidebar, TopHeader
│   │   ├── context/            # AuthContext (mode & role state)
│   │   ├── hooks/              # useAuth hook
│   │   ├── pages/              # Dashboard, Candidates, Reports,
│   │   │                       # Universities, Verifications,
│   │   │                       # ActivityLog, Settings, Auth
│   │   ├── services/api.js     # Axios API client
│   │   └── utils/helpers.js    # localStorage ledger helpers
│   └── index.html
│
└── ocr-service/                # Python Flask OCR microservice
    └── app.py                  # Tesseract-based extraction API
```

---

## 🔍 Verification Workflow

1. **University** uploads a certificate image → OCR extracts student data fields
2. A **SHA-256 canonical hash** is generated from: `studentName|enrollmentNumber|universityName|degreeType|completionYear`
3. The certificate entry is stored in MongoDB with block metadata
4. **Recruiter** queries by entering candidate details (or uploading a certificate image)
5. The **fuzzy matching engine** compares query against ledger entries:
   - ✅ **Exact Match** (≥ 95% score) — Verified
   - ⚠️ **Partial Match** (≥ 80% score) — Verified with warning
   - ❌ **No Match** (< 80%) — Not found / potentially fraudulent

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ for academic integrity and fraud prevention.
