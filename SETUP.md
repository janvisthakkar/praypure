# Praypure MERN Stack Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation Steps

### 1. Backend Setup
cd backend
npm install### 2. Create .env file in backend folder
```
MONGODB_URI=mongodb://localhost:27017/praypure
PORT=5000
NODE_ENV=development
```

### 3. Start Backend Server
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start Frontend
```bash
npm start
```

### 6. Add Logo
Place your logo file at: `frontend/public/assets/logo.png`

## API Endpoints

- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product
- GET `/api/testimonials` - Get all testimonials
- POST `/api/subscribers` - Subscribe email

## Default Ports
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
```

All files are ready. Create the folder structure and add these files. The MERN stack application is set up with:
- Complete backend API
- React frontend with components
- Carousels for hero and testimonials
- Responsive design
- Amazon/Flipkart integration
- Instagram links in gallery

Place your logo at `frontend/public/assets/logo.png` and you're ready to go.
