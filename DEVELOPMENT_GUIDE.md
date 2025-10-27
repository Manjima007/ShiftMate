# 🚀 ShiftMate Development Guide

## ✅ Development Environment Ready!

Your ShiftMate project is now running locally in development mode with the following services:

### 🎯 **Services Status:**
- **AI Model Service**: `http://localhost:8000` ✅ Running
- **API Core Service**: `http://localhost:3000` ✅ Running  
- **Database**: SQLite (`dev.db`) ✅ Connected

---

## 🔧 **Available API Endpoints**

### **API Core Service** (`http://localhost:3000`)

#### **Health & Info**
- `GET /` - Service info and available endpoints
- `GET /api/health` - Health check with database status

#### **Users**
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

#### **Bookings**
- `GET /api/bookings` - List all bookings with items
- `POST /api/bookings` - Create new booking

#### **AI Integration**
- `POST /api/ai/detect` - AI object detection (forwards to AI service)

### **AI Model Service** (`http://localhost:8000`)

#### **AI Endpoints**
- `GET /` - Service info
- `GET /api/v1/ai/health` - AI service health check
- `POST /api/v1/ai/detect` - Object detection from images
- `GET /api/v1/ai/supported-items` - List supported items

---

## 🧪 **Testing the APIs**

### **Test Health Checks**
```bash
# API Core health
curl http://localhost:3000/api/health

# AI Service health  
curl http://localhost:8000/api/v1/ai/health
```

### **Create a Test User**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

### **Create a Test Booking**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_ABOVE",
    "pickupAddress": "123 Main St, City, State",
    "dropoffAddress": "456 Oak Ave, City, State", 
    "distance": 15.5,
    "scheduledDate": "2025-11-01T10:00:00Z",
    "items": [
      {
        "name": "Chair",
        "category": "furniture",
        "volume": 2.5,
        "quantity": 2,
        "confidence": 0.95
      }
    ]
  }'
```

### **Test AI Detection**
```bash
curl -X POST http://localhost:8000/api/v1/ai/detect \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "test_image.jpg",
    "booking_ref": "BOOKING_REF"
  }'
```

---

## 🛠️ **Development Commands**

### **Start Services**

#### **Option 1: Manual Start (Recommended for Development)**
```bash
# Terminal 1 - AI Service
cd services/ai-model
uvicorn main_simple:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - API Core Service
cd services/api-core  
node server.js
```

#### **Option 2: Background Start**
```bash
# AI Service
cd services/ai-model
Start-Process -NoNewWindow -FilePath "uvicorn" -ArgumentList "main_simple:app --reload --host 0.0.0.0 --port 8000"

# API Core Service
cd services/api-core
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
```

### **Database Operations**
```bash
# Navigate to API core
cd services/api-core

# View database schema
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma client
npx prisma generate
```

---

## 📊 **Database Schema**

The SQLite database includes these models:

- **User**: id, email, password, name, phone, role, createdAt
- **Booking**: id, userId, pickupAddress, dropoffAddress, distance, scheduledDate, status, totalPrice, createdAt
- **Item**: id, bookingId, name, category, volume, quantity, confidence

---

## 🔍 **Development Features**

### **API Core Service Features:**
- ✅ CORS enabled for frontend development
- ✅ JSON request/response handling
- ✅ Database connection with Prisma ORM
- ✅ Error handling middleware
- ✅ Graceful shutdown handling
- ✅ Health check with database connectivity test

### **AI Service Features:**
- ✅ Mock object detection for development
- ✅ CORS enabled
- ✅ Health check endpoints
- ✅ Supported items listing
- ✅ Hot reload with uvicorn

---

## 🚨 **Troubleshooting**

### **Port Already in Use**
```bash
# Kill processes on ports 3000 and 8000
netstat -ano | findstr :3000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### **Database Issues**
```bash
cd services/api-core
npx prisma db push --force-reset
npx prisma generate
```

### **Dependencies Issues**
```bash
# API Core
cd services/api-core
npm install

# AI Service  
cd services/ai-model
pip install fastapi uvicorn python-multipart
```

---

## 📝 **Next Steps for Development**

1. **Frontend Development**: Create React/Vue.js apps that connect to these APIs
2. **Authentication**: Add JWT-based authentication
3. **Real AI Model**: Replace mock AI service with actual YOLO model
4. **Payment Integration**: Add Stripe/PayPal integration
5. **Admin Dashboard**: Build admin interface for booking management
6. **Customer App**: Build customer-facing web/mobile app

---

## 🎉 **You're Ready to Develop!**

Both services are running and ready for development. The APIs are fully functional with:
- Database connectivity ✅
- CORS enabled ✅  
- Error handling ✅
- Health checks ✅
- Mock AI detection ✅

Start building your frontend applications or add new features to the backend!
