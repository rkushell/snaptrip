# SnapTrip

A full-stack, collaborative photo-sharing platform designed for seamless media management during group trips. Built with the MERN stack (MongoDB, Express, React, Node.js), this application focuses on performance, secure access control, and optimized media delivery.

**Live Demo:** [https://snaptrip-frontend.onrender.com](https://snaptrip-frontend.onrender.com)

---

## Technical Highlights

### 1. Architecture & System Design
- **Client-Server Model:** Decoupled architecture utilizing a RESTful API backend and a Vite-optimized React frontend.
- **Optimized Asset Delivery:** Integrated with **Cloudinary** for scalable image storage, utilizing CDN delivery and on-the-fly image transformations to reduce bandwidth consumption.
- **Asynchronous Blob Fetching:** Implemented cross-origin photo downloading by fetching media as binary blobs to bypass browser cross-origin constraints.

### 2. Security Implementations
- **Authentication:** Stateless authentication using JSON Web Tokens (JWT) for secure session management.
- **Password Cryptography:** Passwords are salted and hashed using `bcrypt` before database persistence.
- **API Protection:** 
  - Integrated **Helmet.js** to enforce strict HTTP response headers (preventing XSS, clickjacking, etc.).
  - Configured **Express Rate Limit** to mitigate brute-force attacks on authentication endpoints.
  - Strict **CORS** policies restricting API access to the production frontend domain.

### 3. Database & Data Modeling
- **MongoDB Atlas:** Hosted NoSQL database utilizing `mongoose` ODM for schema validation and query construction.
- **Relational Integrity:** Complex population queries to link Users, Trips, and Photos (e.g., aggregating member counts and resolving photo uploaders).
- **Secure Access Control:** Database-level validation ensuring users can only access trips they have joined via unique invite codes.

## Tech Stack

**Frontend Environment:**
- React 19 (Component-driven UI, Context API for state management)
- Vite (HMR and optimized production bundling)
- Tailwind CSS 4 (Utility-first responsive design)
- Axios (Promise-based HTTP client with request interceptors)

**Backend Environment:**
- Node.js & Express.js
- MongoDB & Mongoose ODM
- Cloudinary API (via `multer-storage-cloudinary`)
- JWT, bcrypt, Helmet, express-rate-limit

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
Start the backend server:
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
Start the frontend development server:
```bash
npm run dev
```
