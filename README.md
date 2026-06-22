# SnapTrip

A modern, full-stack photo-sharing application built for friends and families to collaboratively share and manage memories from their trips.

**Live Demo:** [https://snaptrip-frontend.onrender.com](https://snaptrip-frontend.onrender.com)

---

## Features

- **Create & Join Trips:** Easily spin up a new trip and invite friends using a unique invite code.
- **Collaborative Galleries:** Everyone in the trip can upload photos to a shared gallery in real-time.
- **Cloud Storage:** Fast, optimized image hosting powered by Cloudinary.
- **Download Albums:** Download a single photo or bulk-download the entire trip album as a `.zip` file.
- **Secure Authentication:** JWT-based authentication with encrypted passwords and rate limiting.

## Tech Stack

**Frontend:**
- React 19 (Vite)
- Tailwind CSS 4
- React Router DOM
- Axios

**Backend:**
- Node.js & Express
- MongoDB Atlas & Mongoose
- Cloudinary (Image Storage)
- JWT (Authentication)
- Helmet & Express Rate Limit (Security)

## Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/rkushell/snaptrip.git
cd snaptrip
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```

---
*Built as a secure, fast, and beautiful way to preserve memories.*
