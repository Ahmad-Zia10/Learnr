<div align="center">

# 📚 Learnr

### An Ed-Tech Platform Built for the Modern Learner

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**[Live Demo](https://learnr-dusky.vercel.app)** · [API](https://learnr-sne2.onrender.com) · [Report a Bug](https://github.com/Ahmad-Zia10/Learnr/issues) · [Request Feature](https://github.com/Ahmad-Zia10/Learnr/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🌐 Live Demo

| | |
|---|---|
| **Site** | https://learnr-dusky.vercel.app |
| **API** | https://learnr-sne2.onrender.com |

Sign in with any of these to explore a populated account — the catalogue holds
19 courses across 6 categories, with reviews, enrolments and progress already in
place.

| Role | Email | Password |
|---|---|---|
| Student | `aarav.sharma@learnr.dev` | `Learnr@2026` |
| Instructor | `ananya.iyer@learnr.dev` | `Learnr@2026` |

> The API runs on Render's free tier, which sleeps after inactivity. The first
> request can take 30–60 seconds to wake it; everything after that is fast.
>
> Payments use Razorpay **test** keys, so no real money can move. Use card
> `4111 1111 1111 1111` with any future expiry and any CVV.

---

## 🎯 About the Project

**Learnr** is a fully functional, production-ready ed-tech platform that enables users to **create**, **consume**, and **rate** educational content. Built on the **MERN stack**, it bridges the gap between passionate instructors and eager learners across the globe.

### What Learnr Offers

- 🎓 **For Students** — A seamless and interactive learning experience with hands-on projects, quizzes, and personalized instructor feedback.
- 👨‍🏫 **For Instructors** — A powerful platform to showcase expertise, publish courses, and connect with learners worldwide.
- 🔐 **For Admins** — A comprehensive dashboard to oversee platform health, users, and content *(planned)*.

---

## ✨ Features

### Student Features
| Feature | Description |
|---|---|
| 🔐 Authentication | Secure sign-up/login with OTP verification and password reset |
| 📚 Course Browsing | Browse, search, and filter all available courses with ratings |
| ❤️ Wishlist | Save courses for later access |
| 🛒 Cart & Checkout | Seamless purchase flow with Razorpay integration |
| 🎬 Course Player | Watch videos, access materials, and track progress |
| 👤 Profile Management | View and update personal account details |

### Instructor Features
| Feature | Description |
|---|---|
| 📊 Dashboard | Overview of all courses with ratings and revenue insights |
| 📈 Analytics | Detailed metrics — views, clicks, enrollments per course |
| 🛠️ Course Management | Full CRUD for courses, sections, sub-sections, and media |
| ☁️ Media Uploads | Cloud-based storage for videos, images, and PDFs via Cloudinary |
| ✍️ Markdown Support | Rich content editing with Markdown formatting |

### Platform Features
- ⚡ **RESTful API** architecture with JWT-based auth
- 🔒 **Bcrypt** password hashing
- ☁️ **Cloudinary** for media management
- 💳 **Razorpay** payment gateway
- 📱 **Fully Responsive** UI with Tailwind CSS

---

## 🏗️ System Architecture

Learnr follows a **client-server architecture** with three primary layers:

```
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│                 │        │                 │        │                 │
│   Front-end     │◄──────►│   Back-end      │◄──────►│   Database      │
│                 │RESTful │                 │MongoDB │                 │
│   ReactJS       │  API   │   Node.js       │        │   MongoDB       │
│   UI Components │        │   Express.js    │        │   Collections   │
│   Redux Store   │        │   API Endpoints │        │   Documents     │
│   API Calls     │        │   JWT Auth      │        │                 │
└─────────────────┘        └─────────────────┘        └─────────────────┘
         │                          │                          │
         ▼                          ▼                          ▼
      Vercel                  Render/Railway             MongoDB Atlas
```

The backend uses a **monolithic architecture** — all modules are combined in a single codebase for better control, security, and performance.

---

## 🛠️ Tech Stack

### Frontend
- **[ReactJS](https://reactjs.org/)** — Component-based UI library
- **[Redux Toolkit](https://redux-toolkit.js.org/)** — Global state management
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework
- **[React Router v6](https://reactrouter.com/)** — Client-side routing
- **[Axios](https://axios-http.com/)** — HTTP client for API calls

### Backend
- **[Node.js](https://nodejs.org/)** — JavaScript runtime
- **[Express.js](https://expressjs.com/)** — Web application framework
- **[MongoDB](https://www.mongodb.com/)** — NoSQL database
- **[Mongoose](https://mongoosejs.com/)** — ODM for MongoDB
- **[JWT](https://jwt.io/)** — Authentication & authorization
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)** — Password hashing

### Services & Integrations
- **[Cloudinary](https://cloudinary.com/)** — Cloud media management
- **[Razorpay](https://razorpay.com/)** — Payment processing
- **[Nodemailer](https://nodemailer.com/)** — Email notifications

### Dev & Deployment
- **[Vercel](https://vercel.com/)** — Frontend hosting
- **[Render](https://render.com/) / [Railway](https://railway.app/)** — Backend hosting
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** — Cloud database

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** `>= 18.0.0`
- **npm** `>= 9.0.0` or **yarn** `>= 1.22.0`
- **MongoDB** (local instance or Atlas URI)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Ahmad-Zia10/Learnr.git
cd Learnr
```

2. **Install dependencies**

```bash
cd backend && npm install
cd ../frontend && npm install
```

3. **Set up environment variables** *(see below)*

4. **Run both servers**

   From the `frontend` directory, one command starts the Vite dev server and the
   API together:

   ```bash
   npm run dev
   ```

   To run them separately, use `npm run dev` in `backend/` and `npm run dev:vite`
   in `frontend/`.

5. **Seed the database** *(optional, but the catalogue is empty without it)*

   ```bash
   cd backend
   npm run seed
   ```

   This wipes and rebuilds the demo content — 11 accounts, 19 courses, 216
   lectures, reviews, orders and progress — then verifies referential integrity.
   Login details are written to `backend/seed/CREDENTIALS.md`, which is
   gitignored. Add `-- --verify` to check the data without changing it.

6. **Open your browser** at `http://localhost:3000`

   In development the Vite proxy forwards `/api/v1` to `localhost:4000`, so every
   request is same-origin and CORS is not involved.

---

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill it in:

```env
# ─── Server ───────────────────────────────────────────
PORT=4000
NODE_ENV=development

# ─── Database ─────────────────────────────────────────
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/Learnr

# ─── Authentication ───────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=24h

# ─── Email (Nodemailer) ───────────────────────────────
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# ─── Cloudinary ───────────────────────────────────────
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=Learnr

# ─── Razorpay ─────────────────────────────────────────
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret
```

Create a `.env` file in the `client/` directory:

```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
REACT_APP_RAZORPAY_KEY=your_razorpay_key_id
```

> ⚠️ **Never commit `.env` files to version control.** Ensure `.env` is in your `.gitignore`.

---

## 📁 Project Structure

```
Learnr/
├── frontend/                         # React frontend
│   ├── public/
│   └── src/
│       ├── assets/                 # Static assets (images, icons)
│       ├── components/             # Reusable UI components
│       │   ├── common/             # Shared components (Navbar, Footer, etc.)
│       │   ├── core/               # Feature-specific components
│       │   │   ├── Auth/
│       │   │   ├── Dashboard/
│       │   │   └── HomePage/
│       ├── hooks/                  # Custom React hooks
│       ├── pages/                  # Route-level page components
│       ├── reducer/                # Redux slices
│       ├── services/               # API call functions
│       │   └── apis.js
│       ├── utils/                  # Utility/helper functions
│       ├── App.js
│       └── index.js
│
├── backend/                         # Node.js + Express backend
│   ├── config/                     # DB connection, Cloudinary config
│   ├── controllers/                # Route handler logic
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   ├── payment.controller.js
│   │   └── profile.controller.js
│   │   └── category.controller.js
│   │   └── resetPassword.controller.js
│   │   └── ratingAndReview.controller.js
│   │   └── section.controller.js
│   │   └── subSection.controller.js
│   ├── middlewares/                # Auth middleware, error handler
│   │   └── auth.middleware.js
│   │   └── error.middleware.js
│   │   └── multer.middleware.js
│   ├── models/                     # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── course.model.js
│   │   ├── section.model.js
│   │   ├── subSection.model.js
│   │   ├── courseProgress.model.js
│   │   ├── ratingAndReview.model.js
│   │   └── category.model.js
│   │   └── otp.model.js
│   │   └── profile.model.js
│   ├── routes/                     # Express route definitions
│   │   ├── user.routes.js
│   │   ├── course.routes.js
│   │   ├── payment.routes.js
│   │   └── profile.routes.js
│   ├── utils/                      # Mailer, image uploader, etc.
│   │   ├── apiResponse.js
│   │   ├── apiError.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   └── mailSender.js
│   └── index.js                    # Entry point
│   └── constant.js
│   └── app.js
├── .gitignore
└── README.md
```

---

## 📡 API Reference

Base URL: `http://localhost:4000/api/v1`

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/signup` | Register a new student or instructor | ❌ |
| `POST` | `/auth/login` | Login and receive JWT token | ❌ |
| `POST` | `/auth/verify-otp` | Verify OTP sent to email | ❌ |
| `POST` | `/auth/forgot-password` | Trigger password reset email | ❌ |
| `POST` | `/auth/reset-password` | Reset password using token | ❌ |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/courses` | Get all published courses | ❌ |
| `GET` | `/courses/:id` | Get a single course by ID | ❌ |
| `POST` | `/courses` | Create a new course | ✅ Instructor |
| `PUT` | `/courses/:id` | Update a course | ✅ Instructor |
| `DELETE` | `/courses/:id` | Delete a course | ✅ Instructor |
| `POST` | `/courses/:id/rate` | Rate a course (1–5) | ✅ Student |

### Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/profile` | Get logged-in user profile | ✅ |
| `PUT` | `/profile` | Update profile details | ✅ |
| `DELETE` | `/profile` | Delete account | ✅ |
| `GET` | `/profile/enrolled-courses` | Get all enrolled courses | ✅ Student |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/payment/capture` | Capture Razorpay payment | ✅ Student |
| `POST` | `/payment/verify` | Verify and enroll on success | ✅ Student |

---

### Sample API Response

**`GET /api/v1/courses`**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc123...",
      "courseName": "Complete Web Development Bootcamp",
      "courseDescription": "Learn HTML, CSS, JS, React, Node and more.",
      "instructor": {
        "_id": "64def456...",
        "firstName": "John",
        "lastName": "Doe"
      },
      "price": 999,
      "thumbnail": "https://res.cloudinary.com/...",
      "ratingAndReviews": [],
      "studentsEnrolled": [],
      "tag": ["Web Development", "JavaScript"]
    }
  ]
}
```
---

## ☁️ Deployment

This project is deployed with the frontend on Vercel and the API on Render.

### Frontend — Vercel

Import the repository and set **Root Directory** to `frontend`. The committed
`vercel.json` supplies the build command, output directory and the SPA rewrite
that keeps client-side routes such as `/catalog/Design` working on reload.

Two environment variables are required:

| Variable | Value |
|---|---|
| `VITE_API_URL` | The API origin, no trailing slash |
| `VITE_RAZORPAY_KEY` | Razorpay **key id** — public by design |

Vite inlines `VITE_*` values at build time, so changing either one needs a
redeploy rather than a restart.

### Backend — Render

Create a Web Service from the same repository with **Root Directory** `backend`.
The committed `render.yaml` declares the rest:

| Setting | Value |
|---|---|
| Build command | `npm ci` |
| Start command | `npm start` |
| Health check | `/` |

Set every variable from `backend/.env.example` in the dashboard. Do **not** set
`PORT` — Render injects it. The server validates its configuration on boot and
exits with the names of anything missing, so a misconfigured deploy fails
immediately rather than one request at a time.

`CORS_ORIGIN` must list the frontend's origin exactly, with no trailing slash;
comma-separate several to allow preview deployments too.

### Payments — Razorpay webhook

Point a webhook at `https://<your-api>/api/v1/payment/verify-signature` for the
`payment.captured` event, and put the secret you choose there in
`RAZORPAY_WEBHOOK_SECRET`. Checkout works without it — the webhook is the
fallback that still fulfils an order when a buyer's browser never returns from
the payment page.

### Database — MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Whitelist `0.0.0.0/0` for cloud access (or specific IPs for production).
3. Copy the connection string into your `MONGODB_URL` env variable.

### Media — Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com).
2. Copy your `Cloud Name`, `API Key`, and `API Secret` to your env.

---

## 🗺️ Roadmap

Planned enhancements in order of priority:

- [x] Core course creation and consumption flow
- [x] Razorpay payment integration
- [x] JWT authentication with OTP verification
- [ ] **High Priority** — Personalized learning paths per student
- [ ] **High Priority** — Native mobile app (React Native)
- [ ] **Medium Priority** — ML-powered course recommendations
- [ ] **Medium Priority** — Gamification: badges, points, leaderboards
- [ ] **Medium Priority** — Social learning: group discussions, peer feedback
- [ ] **Low Priority** — VR/AR integration for immersive course content
- [ ] **Future** — Admin dashboard for platform-wide analytics

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place. Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to your branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

Please make sure your code follows the existing code style, includes relevant tests, and the PR description clearly explains the problem and solution.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

</div>
