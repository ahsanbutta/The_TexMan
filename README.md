# 🌟 The TaxMan's Capital

> **Pakistan's Premier Career, Mentorship & Education Ecosystem for CA, ACCA, and Finance Professionals.**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 📌 Project Overview

**The TaxMan's Capital** is a full-stack digital platform engineered specifically for Chartered Accountancy (**CA/ICAP**), **ACCA**, and finance trainees and qualified professionals in Pakistan and overseas. 

Founded under the visionary leadership of **Saboor Ahmad CA**, the platform connects students with Big 4 firms, offers comprehensive career counseling, provides verified study materials, and delivers an enterprise-grade administrative hub.

---

## ✨ Key Features & Capabilities

### 🎓 1. Student & Professional Career Portal
- **💼 Tri-Sector Job Board**:
  - **Domestic Opportunities**: Corporate finance, tax, and audit vacancies across Pakistan.
  - **Trainee Inductions**: Dedicated articleship & trainee positions for CA (PRC/CAF/CFAP) and ACCA students across Big 4 (PwC / AF Ferguson, KPMG, EY, Deloitte) and top-tier firms.
  - **Overseas Placements**: International roles spanning the Middle East (Dubai, Riyadh, Doha), the UK, and beyond.
- **📚 Study Materials Library**: Curated notes, CAF/CFAP past paper solutions, interview checklists, and CV templates with real-time download counters.
- **🎥 Videos & Podcasts Media Hub**: Direct integration with `@SaboorAhmadCA` YouTube channel featuring firm reviews, rotation policy insights, and test prep masterclasses with interactive video modals.
- **📰 Modern Blog & Editorial System**: Professional career articles, firm induction guides, and industry news with category filtering, reading time estimates, and rich typography.
- **💬 Community Study Rooms**: Instant access to level-specific WhatsApp study rooms and Discord channels (PRC, CAF, CFAP, ACCA).
- **🧭 Career Tools & Support**: Direct counseling query submission, salary estimators, and guidance questionnaires.

---

### 🛡️ 2. Advanced Admin Dashboard
The platform features an executive-level Administrative Control Center:

- **👥 User Profile Management**:
  - View all registered users with role badges (`student`, `mentor`, `admin`, `team_head`) and qualification levels (`CAF`, `CFAP`, `Qualified`, etc.).
  - Direct actions to **Add New Users**, **Edit Profiles**, **Assign Roles**, and **Toggle Account Status (Active / Blocked)**.
  - Search by name, username, or email with instant role and status filters.
- **🔄 Dual Layout (List Table ↔ Cards Grid)**:
  - Every data section features a quick **List / Grid view switcher** for maximum productivity.
- **⚡ Smart 15-Item Pagination**:
  - Clean pagination with item range indicator (`Showing 1 to 15 of 45 results`) and numbered buttons across all sections.
- **📁 Dual Media Upload System (`DualMediaUpload`)**:
  - Supports both **Web URL link** and **Upload from Device** (drag & drop file picker) with instant client-side preview for blog covers, study PDFs/docs, and profile pictures.
- **📝 Blog Publisher & Rich Content Editor**:
  - Create, format, schedule, feature, and publish articles with live preview and draft/publish toggles.
- **💬 Inquiry & Counseling Inbox**:
  - View contact queries and student counseling requests, with built-in modal to submit **Admin Counseling Replies**.

---

### 👤 3. Candidate & User Dashboard
- **Profile Customization**: Update personal information, bio, qualification track, and avatar.
- **CV / Resume Manager**: Upload or link professional resumes via URL or direct device file upload (`.pdf`, `.docx`).
- **Application Tracking**: Monitor status of job and induction applications.
- **Saved Resources**: Quick access to bookmarked study packs and podcasts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite (Ultra-fast HMR and optimized bundling)
- **Styling**: Tailwind CSS (Tailored emerald & dark navy professional palette)
- **Icons**: Lucide React
- **Rich Editor**: Custom responsive rich text & markdown editor
- **Media Handling**: Client-side FileReader DataURL conversion + Cloudinary integration

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies and bcryptjs password hashing
- **Security**: Helmet, CORS protection, Express Rate Limiting
- **File Upload**: Multer with Cloudinary storage adapter
- **AI Analytics**: Google GenAI integration ready

---

## 📂 Project Architecture

```plaintext
The-TaxMan-s-Capital/
├── backend/                        # Express + MongoDB REST API
│   ├── src/
│   │   ├── config/                 # DB, Cloudinary & JWT configs
│   │   ├── controllers/            # Admin, Auth, Blog, Job & Resource controllers
│   │   ├── middleware/             # Auth, role-verification & rate-limiting
│   │   ├── models/                 # Mongoose schemas (User, Job, Blog, Resource, etc.)
│   │   ├── routes/                 # API endpoint routers
│   │   └── server.js               # Backend entry point
│   ├── package.json
│   └── .env.example
│
├── src/                            # React + Vite Frontend
│   ├── assets/                     # Platform logos, badges, and illustrations
│   ├── components/
│   │   ├── blog/                   # RichBlogEditor, BlogCard, etc.
│   │   ├── common/                 # AdminPagination, DualMediaUpload, Modal
│   │   ├── layout/                 # TopNav, Footer, BottomBar, NotificationPanel
│   │   └── FloatingSocials.jsx
│   ├── pages/ios/
│   │   ├── AdminDashboard/         # Executive admin management hub
│   │   ├── UserDashboard/          # Student / candidate dashboard
│   │   ├── Blog/                   # Blog listing & Reader pages
│   │   ├── Jobs/                   # Job board (Domestic, Inductions, Overseas)
│   │   ├── Resources/              # Study materials repository
│   │   ├── Announcements/          # ICAP / platform notices
│   │   ├── Community/              # WhatsApp / Discord study hubs
│   │   ├── CareerTools/            # Mentorship & guidance tools
│   │   └── Login/                  # Authentication & registration
│   ├── services/                   # Axios API service integrations
│   ├── App.jsx                     # Root router & layout wrapper
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas URI)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Sagheer1122/The-TaxMan-s-Capital.git
cd The-TaxMan-s-Capital
```

### 2. Configure Backend
Navigate to the `backend` directory and set up environment variables:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taxmancapital
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
# Production start
npm start

# Development mode (with auto-reload)
npm run dev
```

---

### 3. Configure Frontend
From the root directory, install frontend dependencies:
```bash
cd ..
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 4. Build for Production
To generate an optimized production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready for deployment to Vercel, Netlify, or your preferred hosting provider.

---

## 🔗 Key API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch active session & profile details | Authenticated |
| `GET` | `/api/admin/users` | Retrieve all users with filters | Admin / Team Head |
| `POST` | `/api/admin/users` | Create user profile manually | Admin / Team Head |
| `PUT` | `/api/admin/users/:id` | Update user details or role | Admin / Team Head |
| `PATCH`| `/api/admin/users/:id/status`| Toggle user block / active status | Admin / Team Head |
| `DELETE`| `/api/admin/users/:id` | Delete user record | Admin / Team Head |
| `GET` | `/api/blogs` | Fetch published articles | Public |
| `POST` | `/api/blogs` | Create a new blog post | Admin |
| `GET` | `/api/jobs` | Browse active domestic & overseas jobs | Public |
| `POST` | `/api/contact` | Submit contact / counseling inquiry | Public |

---

## 👥 Leadership & Contributors

- **Saboor Ahmad CA** — *Founder & Lead Career Mentor*
- **Sagheer Ahmad** — *Lead Full-Stack Developer & Platform Architect*

---

## 📄 License
This project is licensed under the **ISC License**.
