# 🚚 ShiftMate - AI-Powered Moving & Storage Management

> A modern, intelligent platform for moving and storage services with AI-driven object detection and volume calculation.

## 📋 Overview

ShiftMate is a comprehensive moving and storage management platform that leverages AI/ML for automatic furniture detection and volume estimation from images. The platform streamlines the moving process by:

- 🤖 **AI-Powered Detection**: Automatically identifies furniture and household items from uploaded images using YOLOv8n
- 📦 **Volume Calculation**: Estimates cubic volume of detected items for accurate pricing
- 🎨 **Visual Feedback**: Displays bounding boxes on detected items with color-coding (red=fragile, green=normal)
- 💰 **Smart Pricing**: Calculates moving costs based on volume, distance, and item fragility
- 📱 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

The platform features a microservices architecture with dedicated services for AI processing and core business logic.

## 🏗️ Architecture

```
┌─────────────────────────────┐
│   React Frontend            │
│   (Vite + React 19)         │
│   Tailwind CSS              │
│   Port: 5173                │
└──────────┬──────────────────┘
           │ REST API
           ▼
┌──────────────────────────────┐     ┌────────────────────┐
│      API Core                │────▶│    SQLite DB       │
│   (Node.js + Express)        │     │    (Prisma ORM)    │
│   Port: 3000                 │     └────────────────────┘
│                              │
│   - Authentication           │
│   - Bookings CRUD            │
│   - Multipart File Proxy     │
└──────────┬───────────────────┘
           │ Multipart Form-Data
           ▼
┌──────────────────────────────┐
│    AI Model Service          │
│  (FastAPI + YOLOv8n)         │
│  Port: 8000                  │
│                              │
│   - Object Detection         │
│   - Image Annotation         │
│   - Volume Estimation        │
│   - Catalog Lookup           │
└──────────────────────────────┘
```

## ✨ Key Features

### � Authentication System
- User registration and login
- Session management with Context API
- Role-based access control (CLIENT, ADMIN, STAFF)

### 🖼️ AI-Powered Detection
- Upload images of furniture and household items
- YOLOv8n model detects 80+ object classes
- Real-time bounding box visualization
- Color-coded annotations (red=fragile, green=normal)
- Confidence scores displayed on each detection

### 📊 Smart Volume Calculation
- Comprehensive item catalog with 80+ items
- 6 categories: Furniture, Electronics, Kitchen, Storage, Decor, Miscellaneous
- Pre-configured volumes for common items
- Fallback estimation for unknown items
- Fragile item identification

### 📋 Booking Management
- Complete booking workflow from detection to confirmation
- Live price calculator with transparent breakdown:
  - Base fee: $50
  - Volume charge: $30/m³
  - Distance charge: $2/km
  - Fragile item surcharge: $20/item
- Pickup and dropoff address management
- Scheduled date selection
- Full booking history with search and filters

### 🎨 Modern User Interface
- Clean, responsive design with Tailwind CSS
- Hero icons for intuitive navigation
- Real-time form validation
- Loading states and error handling
- Mobile-friendly responsive layout

## �🚀 Tech Stack

### Frontend
- **Framework**: React 19.1.1 with Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.13.0
- **Icons**: @heroicons/react 2.2.0
- **Styling**: Tailwind CSS 3.4.1 + Custom CSS
- **State Management**: React Context API

### Backend API Core
- **Runtime**: Node.js with Express 4.18.2
- **Database**: SQLite with Prisma ORM 6.17.1
- **File Upload**: Multer 2.0.2
- **HTTP Client**: Axios 1.13.0
- **CORS**: CORS 2.8.5
- **Form Data**: form-data 4.0.4

### AI Model Service
- **Framework**: FastAPI 0.104.1+
- **Server**: Uvicorn with standard extras
- **AI Model**: Ultralytics YOLOv8n 8.3.0+
- **Image Processing**: 
  - OpenCV (opencv-python) 4.8.1.78+
  - Pillow 10.2.0+
  - NumPy
- **Validation**: Pydantic 2.10.0+
- **File Handling**: python-multipart 0.0.6+

### Database Schema
- **Users**: Authentication and profile data
- **Bookings**: Moving requests with pricing
- **Items**: Detected items with quantities and volumes
- **Relationships**: One-to-many (User → Bookings → Items)

## 📦 Project Structure

```
ShiftMate/
├── frontend-react/              # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # React Context (AppContext)
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Authentication
│   │   │   ├── Upload.jsx       # Image upload & AI detection
│   │   │   ├── NewBooking.jsx   # Booking form with invoice
│   │   │   └── Bookings.jsx     # Booking management
│   │   ├── styles/              # CSS modules
│   │   └── App.jsx              # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── services/
│   ├── api-core/                # Node.js backend API
│   │   ├── server.js            # Express server
│   │   ├── prisma/
│   │   │   └── schema.prisma    # Database schema
│   │   ├── generated/           # Prisma client
│   │   └── package.json
│   │
│   └── ai-model/                # Python AI service
│       ├── main.py              # FastAPI application
│       ├── schemas.py           # Pydantic models
│       ├── config.py            # Configuration
│       ├── run_server.py        # Server launcher
│       ├── data/
│       │   └── item_catalog.json  # 80+ item definitions
│       ├── utils/
│       │   ├── image_processing.py  # Bounding boxes
│       │   └── volume_calculator.py # Volume estimation
│       └── requirements.txt
│
├── README.md
├── DEVELOPMENT_GUIDE.md
└── docker-compose.yml

```

## 🛠️ Getting Started

### Prerequisites

#### Required Software
- **Node.js**: Version 18+ (for API Core and Frontend)
- **Python**: Version 3.10+ (for AI Model Service)
- **Git**: For version control

#### Development Environment
- **OS**: Windows (PowerShell), macOS, or Linux
- **RAM**: Minimum 8GB recommended (for YOLOv8n model)
- **Disk Space**: ~2GB for dependencies and models

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Manjima007/ShiftMate.git
cd ShiftMate
```

#### 2. Setup API Core Service

```bash
cd services/api-core

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start the server (Port 3000)
npm start
```

The API Core will be available at `http://localhost:3000`

#### 3. Setup AI Model Service

```bash
cd services/ai-model

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server (Port 8000)
python run_server.py
```

The AI Service will be available at `http://localhost:8000`

**Note**: First run will automatically download YOLOv8n model (~6MB)

#### 4. Setup Frontend

```bash
cd frontend-react

# Install dependencies
npm install

# Start development server (Port 5173)
npm run dev
```

The Frontend will be available at `http://localhost:5173`

### Quick Start (All Services)

**Terminal 1 - API Core:**
```powershell
cd services/api-core
npm start
```

**Terminal 2 - AI Model:**
```powershell
cd services/ai-model
python run_server.py
```

**Terminal 3 - Frontend:**
```powershell
cd frontend-react
npm run dev
```

### Verify Installation

1. **API Core Health Check**: http://localhost:3000/api/health
2. **AI Service Health Check**: http://localhost:8000/
3. **Frontend**: http://localhost:5173

Expected responses:
- API Core: `{"status":"healthy","database":"connected",...}`
- AI Service: `{"message":"ShiftMate AI Model Service",...}`
- Frontend: Landing page with navigation

## 📖 User Guide

### Creating an Account

1. Navigate to http://localhost:5173
2. Click **"Login"** in the navigation
3. Click **"Create Account"** tab
4. Fill in your details:
   - Full Name
   - Email Address
   - Phone Number (optional)
   - Password
5. Click **"Create Account"**

### Uploading Images for Detection

1. **Login** to your account
2. Click **"Upload"** in the navigation
3. **Select an image** of your furniture/items
   - Supported formats: JPG, PNG, JPEG
   - Max size: 10MB
   - Best results: Clear, well-lit photos
4. Click **"Detect Items"**
5. View results:
   - Annotated image with bounding boxes
   - Detected items with names and volumes
   - Item categories and fragility status

### Creating a Booking

1. After detection, click **"Proceed to Booking"**
2. Fill in booking details:
   - **Pickup Address**: Where items will be collected
   - **Dropoff Address**: Delivery destination
   - **Distance**: Distance in kilometers
   - **Scheduled Date**: When you want the move
3. Review the price breakdown:
   - Base fee: $50
   - Volume charge: $30 per cubic meter
   - Distance charge: $2 per kilometer
   - Fragile item surcharge: $20 per fragile item
4. Click **"Confirm Booking"**
5. View confirmation with booking reference

### Managing Bookings

1. Click **"Bookings"** in the navigation
2. View all your bookings with:
   - User name and email
   - Booking reference
   - Status (pending, confirmed, in_progress, completed, cancelled)
   - Pickup/dropoff addresses
   - Scheduled date
   - Total volume and distance
   - Number of items
3. **Search** by reference, name, or email
4. **Filter** by status using the tabs
5. Click **"Refresh"** to update the list

## 📝 API Documentation

### API Core Endpoints

#### Authentication

**Register New User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "1234567890",
  "role": "CLIENT"
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "1234567890",
  "role": "CLIENT",
  "createdAt": "2025-10-28T..."
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CLIENT",
  ...
}
```

#### Bookings

**Get All Bookings**
```http
GET /api/bookings

Response: 200 OK
[
  {
    "id": 1,
    "reference": "BK-001",
    "userId": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    },
    "pickupAddress": "123 Main St",
    "dropoffAddress": "456 Oak Ave",
    "distance": 15.5,
    "scheduledDate": "2025-11-01T10:00:00Z",
    "status": "pending",
    "totalVolume": 2.5,
    "items": [...],
    "createdAt": "2025-10-28T..."
  }
]
```

**Create Booking**
```http
POST /api/bookings
Content-Type: application/json

{
  "userId": 1,
  "pickupAddress": "123 Main St",
  "dropoffAddress": "456 Oak Ave",
  "distance": 15.5,
  "scheduledDate": "2025-11-01T10:00:00Z",
  "items": [
    {
      "itemId": 1,
      "name": "Chair",
      "category": "Furniture",
      "quantity": 2,
      "volume": 0.5,
      "isFragile": false
    }
  ]
}

Response: 201 Created
{
  "id": 1,
  "reference": "BK-001",
  ...
}
```

**Get User**
```http
GET /api/users/:id

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "1234567890",
  "role": "CLIENT"
}
```

#### AI Detection Proxy

**Detect Items from Image**
```http
POST /api/ai/detect
Content-Type: multipart/form-data

file: [image file]

Response: 200 OK
{
  "detected_items": [
    {
      "item_id": 1,
      "class_id": 56,
      "class_name": "Chair",
      "category": "Furniture",
      "confidence": 0.85,
      "quantity": 2,
      "volume_cubic_meters": 0.5,
      "is_fragile": false,
      "bbox": [100, 150, 300, 400]
    }
  ],
  "total_volume": 1.0,
  "annotated_image": "data:image/jpeg;base64,..."
}
```

### AI Model Service Endpoints

**Root / Health Check**
```http
GET /

Response: 200 OK
{
  "message": "ShiftMate AI Model Service",
  "version": "1.0.0",
  "model": "YOLOv8n",
  "status": "ready"
}
```

**Detect Objects**
```http
POST /api/v1/ai/detect
Content-Type: multipart/form-data

file: [image file]

Response: 200 OK
{
  "detected_items": [...],
  "total_volume": 2.5,
  "annotated_image": "base64_encoded_string"
}
```

## 🎨 Item Catalog

The AI service includes a comprehensive catalog of 80+ items across 6 categories:

### Categories

1. **Furniture** (18 items)
   - Chair, Couch, Bed, Dining Table, etc.
   - Volume range: 0.5 - 2.5 m³

2. **Electronics** (8 items)
   - TV, Laptop, Monitor, Keyboard, etc.
   - Marked as fragile
   - Volume range: 0.01 - 0.3 m³

3. **Kitchen** (11 items)
   - Refrigerator, Microwave, Oven, Sink, etc.
   - Volume range: 0.05 - 2.0 m³

4. **Storage** (7 items)
   - Suitcase, Backpack, Handbag, etc.
   - Volume range: 0.03 - 0.15 m³

5. **Decor** (7 items)
   - Vase, Clock, Potted Plant, etc.
   - Fragile items marked
   - Volume range: 0.02 - 0.1 m³

6. **Miscellaneous** (29 items)
   - Books, Bottles, Cups, Sports Equipment, etc.
   - Volume range: 0.01 - 0.5 m³

Each item includes:
- Volume in cubic meters
- Fragile status (affects pricing)
- Weight estimate
- Dimensions
- Category classification

## 🔧 Configuration

### Environment Variables

Create `.env` files in respective service directories:

**API Core** (`services/api-core/.env`):
```env
PORT=3000
DATABASE_URL="file:./dev.db"
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

**AI Model** (`services/ai-model/.env`):
```env
PORT=8000
MODEL_NAME=yolov8n
CONFIDENCE_THRESHOLD=0.25
```

**Frontend** (`frontend-react/.env`):
```env
VITE_API_URL=http://localhost:3000
```

### Database Configuration

The project uses SQLite with Prisma ORM. Schema is defined in `services/api-core/prisma/schema.prisma`.

**Reset Database:**
```bash
cd services/api-core
npx prisma migrate reset
npx prisma generate
```

**View Database:**
```bash
cd services/api-core
npx prisma studio
```

Opens Prisma Studio at http://localhost:5555

## 📊 Database Schema

### Users Table
```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String
  phone     String?
  role      String    @default("CLIENT")
  bookings  Booking[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Bookings Table
```prisma
model Booking {
  id              Int       @id @default(autoincrement())
  reference       String    @unique
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  pickupAddress   String
  dropoffAddress  String
  distance        Float
  scheduledDate   DateTime
  status          String    @default("pending")
  totalVolume     Float?
  notes           String?
  items           Item[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### Items Table
```prisma
model Item {
  id         Int      @id @default(autoincrement())
  bookingId  Int
  booking    Booking  @relation(fields: [bookingId], references: [id])
  itemId     Int
  name       String
  category   String
  quantity   Int
  volume     Float
  isFragile  Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

  createdAt  DateTime @default(now())
}
```

## � Testing

### Manual Testing

1. **Test AI Detection**
   ```bash
   cd services/ai-model
   python test_simple.py
   ```

2. **Test API Endpoints**
   Use tools like:
   - Postman
   - cURL
   - Browser DevTools
   - VS Code REST Client

3. **Frontend Testing**
   - Navigate through all pages
   - Test image upload with various sizes
   - Test booking creation flow
   - Test search and filter functionality

### Sample cURL Commands

**Test AI Detection:**
```bash
curl -X POST http://localhost:8000/api/v1/ai/detect \
  -F "file=@/path/to/image.jpg"
```

**Test Authentication:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

**Test Booking Creation:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "pickupAddress": "123 Main St",
    "dropoffAddress": "456 Oak Ave",
    "distance": 15.5,
    "scheduledDate": "2025-11-01T10:00:00Z",
    "items": []
  }'
```

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
- Windows: `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force`
- macOS/Linux: `lsof -ti:3000 | xargs kill -9`

**2. YOLOv8 Model Not Found**
```
Error: Model file not found
```
**Solution:**
- Delete `yolov8n.pt` if exists
- Restart AI service - model will auto-download

**3. Prisma Client Not Generated**
```
Error: @prisma/client did not initialize yet
```
**Solution:**
```bash
cd services/api-core
npx prisma generate
```

**4. Python Virtual Environment Issues**
```
Error: No module named 'fastapi'
```
**Solution:**
- Ensure virtual environment is activated
- Reinstall: `pip install -r requirements.txt`

**5. CORS Errors in Frontend**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify API Core is running on port 3000
- Check CORS configuration in `server.js`

**6. Image Upload Fails**
```
Error: File too large
```
**Solution:**
- Reduce image size (max 10MB)
- Compress image before uploading

### Debug Mode

**Enable Detailed Logging:**

API Core - modify `server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

AI Service - modify `main.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🚀 Deployment

### Production Checklist

- [ ] Change all passwords and secrets
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS/TLS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up logging and monitoring
- [ ] Enable compression
- [ ] Set up backup strategy
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline

### Docker Deployment (Future)

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🤝 Contributing

### Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'feat: Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Formatting, missing semicolons, etc.
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
perf: Performance improvements
```

### Code Style

- **JavaScript/React**: ESLint configuration
- **Python**: PEP 8 guidelines
- **Formatting**: Use Prettier for JS/React

## � Roadmap

### Current Version: v0.2.0

### Completed Features ✅
- ✅ User authentication and registration
- ✅ AI-powered furniture detection with YOLOv8n
- ✅ Bounding box visualization with color coding
- ✅ Volume calculation and pricing
- ✅ Complete booking workflow
- ✅ Booking management with filters
- ✅ Item catalog with 80+ items
- ✅ Responsive UI with Tailwind CSS

### Upcoming Features 🚀

**Version 0.3.0**
- [ ] Admin dashboard
- [ ] Booking status updates
- [ ] Email notifications
- [ ] Booking history export
- [ ] Multiple image upload

**Version 0.4.0**
- [ ] Payment integration (Stripe/PayPal)
- [ ] Invoice generation (PDF)
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

**Version 1.0.0**
- [ ] Real-time tracking
- [ ] Driver mobile app
- [ ] In-app chat support
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Comprehensive testing suite

## � Support

### Documentation
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [API Documentation](#api-documentation)
- [User Guide](#user-guide)

### Getting Help
- 📧 Email: support@shiftmate.com
- 🐛 Issues: [GitHub Issues](https://github.com/Manjima007/ShiftMate/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Manjima007/ShiftMate/discussions)

## � License

This project is currently unlicensed. All rights reserved.

## 👥 Team

**Development Team:**
- Lead Developer: Manjima007
- AI/ML Engineer: [Name]
- Backend Developer: [Name]
- Frontend Developer: [Name]

## 🙏 Acknowledgments

- **Ultralytics** - YOLOv8 object detection model
- **FastAPI** - Modern Python web framework
- **Prisma** - Next-generation ORM
- **React Team** - UI framework
- **Tailwind CSS** - Utility-first CSS framework

---

**Status**: � In Active Development  
**Last Updated**: October 28, 2025  
**Version**: v0.2.0  
**Branch**: sprint-2-database-schema

---

Made with ❤️ by the ShiftMate Team
