# 🏛️ The TaxMan's Capital — Production REST API Backend

## 📌 Overview
Production-grade Node.js / Express / MongoDB REST API backend engineered specifically for **The TaxMan's Capital** — the leading career, recruitment, and educational mentorship platform for Chartered Accountancy (ICAP) and ACCA students in Pakistan.

---

## 🛠️ Technology Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js (MVC Architecture)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with `httpOnly` secure cookies & Bearer Authorization Header
- **Password Encryption**: `bcryptjs` (12 salt rounds)
- **File Storage**: Cloudinary SDK + Multer Memory Streaming
- **Email Dispatch**: Nodemailer with HTML templates
- **Security**: Helmet, CORS, Morgan, Express Rate Limit, Zod Schema Validation

---

## 📁 Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # MongoDB Connection handler
│   │   └── cloudinary.js     # Cloudinary API Configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   ├── resource.controller.js
│   │   ├── counseling.controller.js
│   │   ├── ai.controller.js
│   │   ├── cv.controller.js
│   │   ├── interview.controller.js
│   │   ├── community.controller.js
│   │   ├── mentor.controller.js
│   │   ├── bookmark.controller.js
│   │   ├── notification.controller.js
│   │   ├── admin.controller.js
│   │   ├── search.controller.js
│   │   ├── upload.controller.js
│   │   └── health.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT Verification & RBAC Guards
│   │   ├── error.middleware.js      # Centralized Error & 404 Handlers
│   │   ├── rateLimit.middleware.js  # Brute-force & AI Throttling
│   │   └── upload.middleware.js     # Multer File Filtering (PDF, DOCX, Img)
│   ├── models/                      # 16 Mongoose Schemas with Indexes
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── JobApplication.js
│   │   ├── Opportunity.js
│   │   ├── Resource.js
│   │   ├── ResourceRequest.js
│   │   ├── CounselingQuery.js
│   │   ├── CommunityGroup.js
│   │   ├── Announcement.js
│   │   ├── Event.js
│   │   ├── EventRegistration.js
│   │   ├── MentorProfile.js
│   │   ├── MentorReview.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Conversation.js
│   │   ├── Resume.js
│   │   ├── InterviewSession.js
│   │   ├── Notification.js
│   │   ├── Bookmark.js
│   │   └── Report.js
│   ├── routes/                      # Modular RESTful Route Handlers
│   ├── services/
│   │   ├── ai.service.js            # Replaceable AI Engine (Tutor & Interview)
│   │   ├── email.service.js         # Nodemailer HTML dispatch
│   │   └── notification.service.js  # In-app notifications
│   ├── utils/
│   │   ├── apiResponse.js           # Standard { success, message, data } formatter
│   │   ├── apiError.js              # Custom ApiError class
│   │   ├── asyncHandler.js          # Async wrapper
│   │   └── seedData.js              # CA/ACCA seed datasets
│   ├── validators/
│   │   └── auth.validator.js        # Zod request validators
│   ├── app.js                       # Express Application Setup
│   ├── server.js                    # Server Bootstrap & DB Connection
│   └── seed.js                      # Database Seeder
├── .env.example
├── .env
├── package.json
└── README.md
```

---

## ⚡ Quickstart Commands

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file (copied from `.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/taxman_capital
JWT_SECRET=super_secret_production_jwt_taxman_capital_2026_key_secure
JWT_EXPIRES_IN=7d
```

### 3. Seed Database with Initial Data
```bash
npm run seed
```
Default accounts created:
- **Admin**: `admin@taxmancapital.com` / `AdminPassword123!`
- **Student**: `student@taxmancapital.com` / `StudentPassword123!`
- **Mentor**: `mentor@taxmancapital.com` / `MentorPassword123!`

### 4. Start Server
```bash
# Production Start
npm start

# Development with Auto-Reload
npm run dev
```

---

## 🌐 Complete API Endpoint Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Health Check & Database Status | Public |
| **POST** | `/api/auth/register` | Register new student/mentor/employer | Public |
| **POST** | `/api/auth/login` | Login and obtain JWT cookie & token | Public |
| **POST** | `/api/auth/logout` | Clear session cookies | Public |
| **GET** | `/api/auth/me` | Get active session profile | Authenticated |
| **PUT** | `/api/auth/profile` | Update profile info & qualification | Authenticated |
| **PUT** | `/api/auth/change-password` | Change user password | Authenticated |
| **GET** | `/api/jobs` | Search & Filter Jobs / Inductions | Public |
| **GET** | `/api/jobs/:id` | View single job specifications | Public |
| **POST** | `/api/jobs` | Create new job posting | Admin / Employer |
| **PUT** | `/api/jobs/:id` | Edit job posting | Admin / Owner |
| **DELETE**| `/api/jobs/:id` | Delete job posting | Admin / Owner |
| **POST** | `/api/jobs/:id/apply` | Apply for job with CV | Authenticated |
| **GET** | `/api/resources` | Get categorized study notes & past papers | Public |
| **POST** | `/api/resources/:id/download` | Record download increment | Public |
| **POST** | `/api/resources/requests` | Request missing study material | Public |
| **POST** | `/api/counseling/queries` | Submit career query / book counseling | Public |
| **GET** | `/api/counseling/my-queries` | View user's counseling inquiries & replies | Authenticated |
| **PUT** | `/api/counseling/queries/:id/reply`| Send mentor reply to query | Admin / Mentor |
| **POST** | `/api/ai/study-tutor` | 24/7 AI Study Tutor Q&A | Public / Auth |
| **POST** | `/api/ai/cv/improve-summary` | AI CV summary generator | Public / Auth |
| **POST** | `/api/ai/interview/evaluate` | AI mock interview response grader | Public / Auth |
| **POST** | `/api/interviews/start` | Start Mock Interview Session | Authenticated |
| **POST** | `/api/interviews/:id/answer`| Record verbal/written answer with AI score | Authenticated |
| **POST** | `/api/interviews/:id/complete`| Finalize interview performance scorecard | Authenticated |
| **GET** | `/api/cv` / **POST** `/api/cv` | CV Builder CRUD | Authenticated |
| **GET** | `/api/community/groups` | List verified WhatsApp / Discord groups | Public |
| **GET** | `/api/community/posts` | Peer discussions feed | Public |
| **POST** | `/api/community/posts` | Create new community discussion post | Authenticated |
| **POST** | `/api/community/posts/:id/like`| Like / Unlike post | Authenticated |
| **POST** | `/api/community/posts/:id/comments`| Comment on post | Authenticated |
| **POST** | `/api/community/reports` | Report inappropriate content | Authenticated |
| **GET** | `/api/mentors` | List qualified mentors | Public |
| **POST** | `/api/mentors/:id/reviews` | Submit review for mentor | Authenticated |
| **POST** | `/api/bookmarks/toggle` | Save / Unsave Job bookmark | Authenticated |
| **GET** | `/api/bookmarks` | View saved jobs | Authenticated |
| **GET** | `/api/notifications` | View system alerts & replies | Authenticated |
| **GET** | `/api/search?q=...` | Categorized platform global search | Public |
| **POST** | `/api/uploads/single` | Upload Image / PDF to Cloudinary | Public / Auth |
| **GET** | `/api/admin/dashboard` | Admin KPI statistics & feeds | Admin Only |
| **GET** | `/api/admin/users` | Manage user roles & access | Admin Only |
