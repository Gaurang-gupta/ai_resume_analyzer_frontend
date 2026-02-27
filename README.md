# 📄 AI Resume Analyzer

AI Resume Analyzer is a full-stack AI application that evaluates resumes against job descriptions using asynchronous background processing and structured LLM analysis.

It combines a modern analytics dashboard with a production-style backend architecture designed for reliability, retry safety, and real-time status updates.

---

## 🚀 Core Capabilities

### 📊 Resume Evaluation

- AI-generated overall score (0–100)
- Component breakdown:
    - Skills alignment
    - Experience alignment
    - Education match
- Structured improvement recommendations
- Human-readable narrative summary

### 📈 Analytics Dashboard

- Score trend visualization across analyses
- Moving averages & volatility tracking
- Skill gap analysis
- Experience mismatch insights
- Education pass/fail metrics
- Score distribution histogram

### 📄 Exportable Reports

- AI-generated summary
- Downloadable PDF performance report

---

## 🏗 How It Works

1. User uploads resume + job description
2. Resume metadata stored in Supabase
3. Analysis job is created in the database
4. Background worker atomically claims the job
5. LLM processes structured prompt
6. Validated structured result is stored
7. UI updates in real-time via Supabase

This architecture separates user interaction from AI processing, ensuring responsiveness and reliability.

---

## ⚙️ Architecture Overview

The system follows production-inspired backend principles:

- Asynchronous job queue processing
- Atomic job claiming (`FOR UPDATE SKIP LOCKED`)
- Retry logic with exponential backoff
- Crash-safe job recovery
- Idempotent processing
- Structured LLM output validation
- Token usage + duration tracking
- Prompt versioning for reproducibility

Backend worker entry point:

```
worker/index.ts
```

Supporting modules:

- `llmClient.ts` → Handles model interaction and structured response validation
- `analyzeResume.ts` → Orchestrates analysis workflow
- `types.ts` → Centralized type definitions

For deeper technical details, see:

```
/backend/architecture.md
```

---

## 🧠 AI Processing

- Structured prompt design
- Deterministic JSON response schema
- Token usage tracking (input/output)
- Model version logging
- Duration measurement for performance monitoring

The system is built to ensure reproducibility and observability of AI results.

---

## 🗄 Backend & Storage

- Supabase (PostgreSQL) for data persistence
- Realtime status updates
- Background worker for AI job processing
- Resume content caching to avoid redundant LLM calls

---

## 📦 Tech Stack

| Layer              | Technology                        |
|--------------------|----------------------------------|
| Frontend           | Next.js, React, TypeScript       |
| Styling            | Tailwind CSS                     |
| Visualization      | Recharts                         |
| Backend & Database | Supabase (PostgreSQL + APIs)     |
| AI Processing      | LLM API Integration              |
| Worker Runtime     | Node.js                          |

---

## 🛠 Getting Started

### ✅ Requirements

- Node.js 18+
- NPM or Yarn
- Supabase project

---

### 🔧 Installation

```bash
git clone https://github.com/Gaurang-gupta/AI_resume_analyzer.git
cd AI_resume_analyzer
npm install
```

Create a `.env.local` file in the root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

If running the backend worker separately:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_api_key
```

---

### 🚀 Run Locally

Frontend:

```bash
npm run dev
```

Worker (if separate process):

```bash
npm run worker
```

Open in browser:

```
http://localhost:3000
```

---

## 📌 Usage Flow

1. Upload resume + job description
2. Analysis job is created
3. Worker processes AI evaluation
4. Dashboard updates automatically
5. Review insights & export PDF

---

## 🧪 Environment Variables

| Variable                      | Description                  |
|--------------------------------|------------------------------|
| NEXT_PUBLIC_SUPABASE_URL       | Supabase project URL        |
| NEXT_PUBLIC_SUPABASE_ANON_KEY  | Supabase anon key           |
| SUPABASE_SERVICE_ROLE_KEY      | Backend service key         |
| OPENAI_API_KEY                 | LLM API key                 |

---

## 📊 Project Goals

This project demonstrates:

- Async background processing
- Safe concurrent job handling
- Structured AI system design
- Observability (token tracking, duration metrics)
- Clean UI backed by real-time data
- Production-style architecture for portfolio use

---

## 👥 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## 📝 License

MIT License