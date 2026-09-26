# API Documentation - CAREERMIND AI

Base URL: `http://localhost:8000/api`

## Authentication Endpoints
* `POST /api/auth/register`: Register user. Request: `{ name, email, password }`. Response: `{ access_token, user_id, email }`
* `POST /api/auth/login`: Authenticate user. Request: `{ email, password }`. Response: `{ access_token, user_id, email }`
* `GET /api/auth/me`: Get active user profile context.
* `POST /api/auth/forgot-password`: Send password reset email.

## Profile Endpoints
* `GET /api/profile`: Retrieve user profile details.
* `PUT /api/profile`: Update target role, experience level, education, and skills.

## Resumes Endpoints
* `POST /api/resumes/upload`: Upload PDF/DOCX/TXT resume file. Returns extracted skills, section data, and ATS quality score breakdown.
* `GET /api/resumes`: Get uploaded resumes history.
* `POST /api/resumes/improve`: Generate improved summary for target role.

## Job Matching & Skills Endpoints
* `POST /api/matching/analyze`: Compute compatibility score between resume/profile and target job description.
* `GET /api/skills/dna`: Retrieve Career DNA profile and radar chart data points.
* `GET /api/skills/gaps`: Retrieve skill gap analysis and priority skill rankings.

## Career Roadmap & Interview Endpoints
* `POST /api/roadmap/generate`: Generate 6-month personalized career roadmap.
* `PUT /api/roadmap/item/{id}`: Update roadmap item status (`Not Started`, `In Progress`, `Completed`).
* `POST /api/interview/start`: Start AI Mock Interview session.
* `POST /api/interview/{id}/answer`: Evaluate user answer.
* `GET /api/interview/{id}/results`: Generate comprehensive interview performance report.
* `POST /api/interview/coding/submit`: Run sandboxed python coding challenge.

## Assistant & Applications Endpoints
* `POST /api/assistant/chat`: RAG AI Career Assistant chat interface.
* `GET /api/applications`: Get tracked job applications.
* `POST /api/applications`: Add application to tracker.
* `GET /api/analytics`: Retrieve admin platform analytics metrics.
* `GET /api/health`: Check API health status.
