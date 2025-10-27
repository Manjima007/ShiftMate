# ShiftMate React Frontend

Modern React-based frontend for the ShiftMate AI-powered moving & storage management system.

## 🚀 Features

- **AI Object Detection**: Upload images to automatically detect and catalog items using YOLOv8
- **Volume Calculation**: Automatic volume calculation for accurate moving estimates
- **Booking Management**: Create and track bookings with detailed item inventories
- **User Management**: Admin dashboard for managing customers
- **Real-time System Health**: Monitor API Core, Database, and AI Model status

## 🛠️ Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.0
- **Routing**: React Router 6.26.0
- **HTTP Client**: Axios 1.7.2
- **State Management**: React Context API

## 🏃 Quick Start

```powershell
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5174**

## 🔌 Required Services

Before running the frontend, ensure these services are running:

1. **API Core** (http://localhost:3000)
2. **AI Model** (http://localhost:8000)

Or use the startup script from the root directory:
```powershell
cd ..
.\start_all.ps1
```

## 📄 Pages

- **Home** (`/`) - System health monitoring and overview
- **Upload** (`/upload`) - AI object detection from images
- **Bookings** (`/bookings`) - View and manage bookings
- **Admin** (`/admin`) - User management and statistics

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 API Configuration

API endpoints are configured in `src/services/api.js`:
- API Core: http://localhost:3000/api
- AI Service: http://localhost:8000
