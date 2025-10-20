# 🚚 ShiftMate - AI-Powered Moving & Packing Platform

> A modern, intelligent platform for movers and packers with AI-driven item detection and volume estimation.

## 📋 Overview

ShiftMate is a comprehensive moving and packing service platform that leverages AI/ML for automatic item detection and volume estimation from images. The platform consists of microservices architecture with separate services for AI processing, core business logic, and separate web applications for customers and administrators.

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Customer App   │     │   Admin App     │     │                 │
│   (React/Vue)   │────▶│   (React/Vue)   │────▶│   API Core      │
└─────────────────┘     └─────────────────┘     │   (Node.js)     │
                                                 │   Port: 3000    │
                                                 └────────┬────────┘
                                                          │
                                    ┌─────────────────────┼─────────────────────┐
                                    │                     │                     │
                                    ▼                     ▼                     ▼
                            ┌───────────────┐     ┌──────────────┐    ┌──────────────┐
                            │  AI Model     │     │  PostgreSQL  │    │   Payment    │
                            │  (FastAPI)    │     │  Database    │    │   Gateway    │
                            │  Port: 8000   │     │  Port: 5432  │    │              │
                            └───────────────┘     └──────────────┘    └──────────────┘
```

## 🚀 Tech Stack

### Backend
- **API Core**: Node.js 20 + Express.js
- **AI Service**: Python 3.10 + FastAPI + Uvicorn
- **Database**: PostgreSQL 15

### Frontend (Planned)
- React.js / Vue.js / Next.js
- Tailwind CSS / Material-UI
- TypeScript

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Cloud Platform (AWS/Azure/GCP)

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
