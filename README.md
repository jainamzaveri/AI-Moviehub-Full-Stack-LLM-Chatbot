# AI-Moviehub-Full-Stack-LLM-Chatbot



✨ Key Features
🔐 Authentication & User Profile

User Signup / Login

Google OAuth 2.0 sign-in

Password reset via verification code

JWT-based secure authentication

Profile management: username, password, profile photo, language

🎬 Movie Discovery

Search movies using TMDB

Autocomplete search suggestions

Filters: rating, release year, language, upcoming

Detailed movie pages with cast, crew, synopsis, runtime, ratings, posters, and backdrops

📺 OTT Streaming Availability

Detects streaming platforms like Netflix, Prime Video, Hotstar, etc.

Auto-generates direct search links for each provider

Falls back to Google search when a provider isn’t supported

❤️ Watchlist & Favourites

Add/remove movies instantly

Saved per authenticated user

Clean UI feedback with animations and indicators

🤖 AI Movie Chatbot (Gemini)

Floating chat widget (LinkedIn-style)

Ask questions about the selected movie:

Plot breakdowns

Character analysis

Trivia / easter eggs

Themes and interpretations

Uses Gemini with movie-aware context

Blocks off-topic/unrelated prompts

🎨 UI / UX Highlights

Modern interface with TailwindCSS

Smooth transitions using Framer Motion

Fully responsive, mobile-first layout

Smart autocomplete search bar

Immersive dark theme

🛠️ Tech Stack
Frontend

React (Vite)

TailwindCSS

Axios

Framer Motion

React Icons

Backend

Node.js + Express.js

MongoDB Atlas + Mongoose

JWT Auth

Google OAuth

Gemini AI API

Nodemailer (local) / Email API provider (production)

External APIs

TMDB

Google Gemini

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

📁 Project Structure
moviehub/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   ├── public/
│   └── vite.config.js
│
└── README.md

⚙️ Environment Variables
Backend .env
Variable	Description	Example
MONGO_URI	MongoDB connection string	your_mongodb_connection
JWT_SECRET	JWT secret key	your_jwt_secret
EMAIL_USER	Sender email address	your_email@gmail.com

EMAIL_PASS	Email app password	your_email_app_password
TMDB_API_KEY	TMDB API key	your_tmdb_api_key
GEMINI_API_KEY	Google Gemini API key	your_gemini_api_key
GOOGLE_CLIENT_ID	Google OAuth client ID	your_google_oauth_client_id
Frontend .env
Variable	Description	Example
VITE_BACKEND_LINK	Deployed backend URL	https://your-backend.onrender.com

VITE_TMDB_API	TMDB API key	your_tmdb_api_key
VITE_GOOGLE_AUTH_CLIENT_ID	Google OAuth client ID	your_google_client_id
VITE_EMAIL_API_KEY	Email validator API key	your_email_validator_key
🚀 Local Development Setup
1) Clone the Repository
git clone https://github.com/JAIS0N/netflix-clone-mern.git
cd netflix-clone-mern

🖥️ Backend Setup
cd backend
npm install
# add .env file
npm start dev


Backend runs on: http://localhost:5000

🎨 Frontend Setup
cd ../frontend
npm install
# add .env file
npm run dev


Frontend runs on: http://localhost:5173

🌍 Deployment Guide
🔵 Backend (Render)

Push code to GitHub

Create a New Web Service on Render

Configure:

Root Directory: backend

Build Command: npm install

Start Command: npm start

Add all environment variables

Deploy and copy the backend URL (example):

https://moviehub-backend.onrender.com

🟣 Frontend (Vercel)

Import GitHub project into Vercel

Set Root Directory: frontend

Add environment variables (use Render backend URL)

Deploy (example live URL):

https://moviehub.vercel.app

📡 API Endpoints
Method	Endpoint	Description
POST	/api/users/signup	Register user
POST	/api/users/login	Login
POST	/api/users/google-login	Google OAuth login
GET	/api/users/profile	Fetch user profile (protected)
POST	/api/users/forgotpassword	Start password reset
POST	/api/users/resetpassword	Complete password reset
POST	/api/users/update-list	Update watchlist/favourites
POST	/api/users/change-photo	Update profile photo
POST	/api/users/change-password	Change password
POST	/api/users/change-language	Change language preference
POST	/api/users/change-username	Change username
POST	/api/chat/movie	Send prompt to Gemini AI
✅ Testing Checklist

Signup/Login works correctly

Watchlist/Favourites save per user

Movie details load from TMDB

OTT availability displays properly

AI chatbot answers accurately and stays on-topic

Autocomplete search works smoothly

Password reset flow works end-to-end

UI is fully responsive

🙏 Credits

TMDB API for movie data

Google Gemini for AI chat

MongoDB Atlas, Render, Vercel for infrastructure

Open-source community ❤️
