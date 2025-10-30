# MGNREGA Dashboard Setup Guide

## Quick Start

### Option 1: Windows (Batch Script)
```bash
# Double-click start-dev.bat or run:
start-dev.bat
```

### Option 2: Cross-Platform
```bash
# Install all dependencies
npm run setup

# Start both frontend and backend
npm run dev:full
```

### Option 3: Manual Setup
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Start backend (in one terminal)
npm run dev

# Start frontend (in another terminal)
cd ..
npm run dev
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

## Features Implemented

✅ Multi-language support (English/Hindi)  
✅ Responsive design  
✅ Interactive dashboard with charts  
✅ District selection  
✅ Real-time data refresh  
✅ Backend API with rate limiting  
✅ CORS configuration  
✅ Mock data fallback  
✅ Error handling  

## Project Structure

```
Rural MGNREGA Dashboard_files/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── translations/      # Language files
├── backend/               # Backend API
│   └── src/              # Backend source
├── public/               # Static assets
└── dist/                # Build output
```

## Development

The application uses:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Charts**: Recharts library
- **Icons**: Lucide React