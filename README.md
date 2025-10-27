# 🚚 ShiftMate - AI-Powered Moving & Storage Management

> A modern, intelligent platform for moving and storage services with AI-driven object detection and volume calculation.

## 📋 Overview

ShiftMate is a comprehensive moving and storage management platform that leverages AI/ML for automatic item detection and volume estimation from images. The platform features a microservices architecture with dedicated services for AI processing and core business logic, complemented by a modern React-based frontend.

## 🏗️ Architecture

```
┌─────────────────────────┐
│   React Frontend        │
│   (Vite + React 18)     │
│   Port: 5174            │
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐     ┌────────────────────┐
│      API Core            │────▶│    SQLite DB       │
│   (Node.js + Express)    │     │    (Prisma ORM)    │
│      Port: 3000          │     └────────────────────┘
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│    AI Model Service      │
│  (FastAPI + YOLOv8n)     │
│      Port: 8000          │
└──────────────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18.3.1 with Vite 5.4.0
- **Routing**: React Router 6.26.0
- **HTTP Client**: Axios 1.7.2
- **State Management**: React Context API
- **Styling**: CSS Modules

### Backend
- **API Core**: Node.js 20 + Express.js
- **AI Service**: Python 3.10 + FastAPI + Uvicorn
- **Database**: SQLite with Prisma ORM
- **AI Model**: YOLOv8n (Ultralytics)
- **Image Processing**: OpenCV + Pillow

### Development
- **Version Control**: Git + GitHub
- **Package Managers**: npm (Node), pip (Python)
- **Environment**: Windows + PowerShell

## 📦 Services

### 1. API Core (`services/api-core`)
Main backend service handling:
- User authentication & authorization
- Booking management
- Payment processing
- Business logic
- Database operations

**Port**: 3000

### 2. AI Model Service (`services/ai-model`)
AI/ML service for:
- Object detection from images
- Item classification
- Volume estimation
- Fragile item identification

**Port**: 8000

### 3. Database
PostgreSQL database storing:
- Users & authentication
- Bookings & items
- Pricing & payments
- Analytics data

**Port**: 5432

## 🛠️ Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.10+ (for local development)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ShiftMate
```

2. **Start all services with Docker Compose**
```bash
docker-compose up --build
```

3. **Verify services are running**
- API Core: http://localhost:3000
- AI Model: http://localhost:8000
- Database: localhost:5432

### Local Development

#### API Core
```bash
cd services/api-core
npm install
npm start
```

#### AI Model
```bash
cd services/ai-model
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 📖 Development Roadmap

See [SPRINT_PLAN.md](./SPRINT_PLAN.md) for detailed sprint breakdown and timeline.

### Current Status: Sprint 0 Complete ✅

### Next Sprint: Sprint 1 - AI Model Implementation 🚀

**Key Sprints:**
- ✅ Sprint 0: Infrastructure Setup
- 🚀 Sprint 1: AI Model Service
- 📅 Sprint 2: Database Schema
- 📅 Sprint 3: Authentication & Users
- 📅 Sprint 4: Booking Management
- 📅 Sprint 5: Admin Features
- 📅 Sprint 6: Customer Web App
- 📅 Sprint 7: Admin Web App
- 📅 Sprint 8: Payment Integration
- 📅 Sprint 9: Testing & QA
- 📅 Sprint 10: Deployment

## 🌿 Git Branching Strategy

- `master/main` - Production-ready code
- `sprint-X-feature-name` - Individual sprint branches
- Merge sprints to master upon completion
- Tag releases: `v1.0-sprint1`, `v1.0-sprint2`, etc.

## 📝 API Documentation

### API Core Endpoints (Planned)

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
```

#### Bookings
```
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
```

#### AI Integration
```
POST   /api/bookings/:id/detect-items
GET    /api/bookings/:id/items
```

### AI Model Endpoints

#### Current (Mock)
```
POST   /api/v1/ai/detect
GET    /
```

#### Planned
```
POST   /api/v1/ai/detect
POST   /api/v1/ai/detect-batch
GET    /api/v1/ai/supported-items
GET    /api/v1/ai/health
```

## 🧪 Testing

```bash
# Run API tests
cd services/api-core
npm test

# Run AI service tests
cd services/ai-model
pytest
```

## 📊 Environment Variables

### API Core
```env
DATABASE_URL=postgres://user_mp:password_mp@db:5432/movers_db
PORT=3000
AI_SERVICE_URL=http://ai:8000
JWT_SECRET=your_secret_key
```

### AI Model
```env
PORT=8000
MODEL_PATH=/app/models
```

### Database
```env
POSTGRES_USER=user_mp
POSTGRES_PASSWORD=password_mp
POSTGRES_DB=movers_db
```

## 🤝 Contributing

1. Check [SPRINT_PLAN.md](./SPRINT_PLAN.md) for current sprint
2. Create a branch from master: `git checkout -b sprint-X-feature`
3. Make your changes and commit with meaningful messages
4. Push to your branch: `git push origin sprint-X-feature`
5. Merge to master when sprint is complete

### Commit Message Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
```

## 📄 License

[Add your license here]

## 👥 Team

[Add team members]

## 📞 Contact

[Add contact information]

---

**Status**: 🚧 In Development  
**Last Updated**: October 21, 2025  
**Version**: v0.1.0 (Sprint 0 Complete)
