# Rudranil Koley - Data Analyst Portfolio

A modern, premium full-stack portfolio website built for a Data Analyst, featuring a dark theme, glassmorphism UI, and a complete Admin Panel for content management.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### 1. Setup Backend
1. Open terminal and navigate to `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Setup `.env` file based on `.env.example` (or use the one already created).
4. Start MongoDB server locally (or configure Atlas URI).
5. Run the seed script to create default admin: `node seed.js` (Username: admin, Password: admin123)
6. Start the server: `npm run dev` or `node server.js`
   - Server runs on `http://localhost:5000`

### 2. Setup Frontend
1. Open a new terminal and navigate to `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
   - App runs on `http://localhost:5173`

## Features
- Dynamic Projects and Certifications fetched from the database.
- Premium UI with Framer Motion scroll animations.
- Secure Admin Panel (`/admin/login`) to manage projects, certifications, and view contact messages.
- Smooth mouse glow effect and animated background blobs.
- Fully responsive design.

## Deployment Notes
- For the backend, ensure the `uploads` folder persists (use AWS S3 or Cloudinary for production).
- Update frontend API calls (`http://localhost:5000/api/...`) to point to the production backend URL.
- Add your actual `resume.pdf` to the `frontend/public/` folder.
