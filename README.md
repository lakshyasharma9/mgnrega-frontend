# Rural MGNREGA Dashboard

A comprehensive dashboard for monitoring MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data across rural districts.

## Features

- Multi-language support (English, Hindi, Bengali)
- Real-time district data visualization
- Interactive charts and statistics
- MongoDB backend integration
- Responsive design

## Setup Instructions

### Frontend (React)
```bash
npm install
npm start
```

### Backend (Node.js + MongoDB)
```bash
# Install backend dependencies
npm install --prefix . -f package-backend.json

# Start MongoDB (ensure MongoDB is running)
# Seed the database
node scripts/runSeed.js

# Start backend server
node server.js
```

### Environment Configuration
- Copy `.env.backend` and configure MongoDB connection
- Update `.env` for React app API endpoint

## API Endpoints

- `GET /api/districts` - Get all districts
- `GET /api/districts/:name` - Get district data
- `GET /api/districts/:name/chart` - Get chart data

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose
- Database: MongoDB