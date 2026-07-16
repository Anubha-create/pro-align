# PRO-ALIGN: Talent Match & Optimization Portal

### 🛠️ Created & Maintained by **Anubha**

PRO-ALIGN is a complete production-ready AI-powered web application that analyzes a candidate's resume against a Job Description (JD), calculates ATS (Applicant Tracking System) compatibility scores, identifies missing skills, suggests section-specific improvements, and simulates a mock interview prep with detailed AI answers (including STAR frameworks, pitfalls, and coaching tips).

---


## Key Features

1. **ATS Score Card**: Visual breakdowns of Keyword Match (40%), Experience (20%), Projects (15%), Education (10%), Certifications (5%), and Semantic Similarity (10%). Includes checks on formatting, grammar rules, and readability.
2. **Match Score Radial Gauge**: Responsive, animated Recharts gauge showing alignment levels (High, Medium, Low).
3. **Keyword Gap Checker**: Color-coded matched skills vs. missing gaps side-by-side.
4. **Resume Rewriter**: One-click AI content optimizer that integrates missing keywords into resume sections (Summary, Experience, Projects, Skills) with strong action verbs.
5. **Interview Simulator**: Tailored mock Q&As categorized into Technical, Behavioral, Role-Specific, and HR, with deep-dive STAR method answers, common mistakes, and delivery tips.
6. **PDF Report Compiler**: Downloadable, professional PDF reports detailing full scores, matching dashboards, and interview prep guides using ReportLab.
7. **Secure Sessions**: Full JWT (JSON Web Tokens) Authentication (Register, Login, Profile) with secure SQLite (dev) / PostgreSQL (production) configurations.
8. **Responsive Dark/Light Mode**: Full modern, glassmorphic layout supporting responsive toggles.

---

## Folder Structure

```
PRO-ALIGN/
├── backend/
│   ├── app.py                   # Flask App Entrypoint
│   ├── config.py                # Configuration Variables
│   ├── requirements.txt         # Package dependencies
│   ├── .env                     # Local configuration keys (Gemini API)
│   ├── routes/                  # API blueprint controllers
│   ├── models/                  # SQLAlchemy tables (User, Resume, Analysis)
│   └── services/                # Parsers, scoring engine, AI rewriters, PDF compiler
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Main React Router
    │   ├── index.css            # Base Tailwind v4 styles
    │   ├── context/             # AppContext (Auth state, Theme, History)
    │   ├── pages/               # Login, Signup, ForgotPassword, Dashboard
    │   └── components/          # Sidebar, MatchGauge, KeywordTags, Suggestions, InterviewCoach
    ├── tailwind.config.js
    └── package.json
```

---

## Setup & Running Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)

### 1. Backend Service
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```
   Add your Google Studio **Gemini API Key** to `GEMINI_API_KEY`.
5. Run the server from the root workspace directory `PRO-ALIGN/`:
   ```bash
   python -m backend.app
   ```
   The backend will start at `http://localhost:5000`.

### 2. Frontend client
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The client application will start at `http://localhost:5173`.

---

## Cloud Deployment

### 1. Database (Supabase PostgreSQL)
1. Initialize a free PostgreSQL database on [Supabase](https://supabase.com/).
2. Fetch the Connection String (transaction mode/direct pooler).

### 2. Backend (Render)
1. Push the code to GitHub.
2. Link the repository to [Render](https://render.com/) as a **Web Service**.
3. Set the Environment Variables on Render:
   - `DATABASE_URL`: `postgresql://<user>:<pwd>@<db-host>/postgres`
   - `JWT_SECRET_KEY`: `your-production-secret-key`
   - `GEMINI_API_KEY`: `your-gemini-studio-api-key`
   - `PORT`: `5000`
4. Set the Build Command: `pip install -r backend/requirements.txt`
5. Set the Start Command: `gunicorn --bind 0.0.0.0:$PORT backend.app:app`

### 3. Frontend (Vercel)
1. Push the code to GitHub.
2. Link the project to [Vercel](https://vercel.com/).
3. Configure the Root Directory to `frontend`.
4. Set the environment variable:
   - `VITE_API_URL`: Set to your deployed Render Web Service URL (e.g. `https://pro-align-api.onrender.com/api`).
5. Click **Deploy**. Vercel will build and serve the production bundles automatically.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | No | Creates a new user account |
| **POST** | `/api/auth/login` | No | Authenticats and returns a JWT access token |
| **POST** | `/api/auth/forgot-password` | No | Sends recovery instructions |
| **GET** | `/api/profile` | Yes | Retrieves authenticated user profile details |
| **POST** | `/api/upload-resume` | Yes | Uploads resume and extracts content |
| **POST** | `/api/upload-jd` | Yes | Uploads and processes job description tags |
| **POST** | `/api/analyze` | Yes | Runs weighted matching engine and saves report |
| **POST** | `/api/rewrite` | Yes | Invokes AI optimizer to rewrite resume elements |
| **POST** | `/api/interview` | Yes | Generates simulator questions based on skills |
| **GET** | `/api/history` | Yes | Fetches analysis reports history for the account |
| **POST** | `/api/report` | Yes | Compiles and downloads a PDF summary report |
| **DELETE** | `/api/report/<id>` | Yes | Deletes a report from user history |
