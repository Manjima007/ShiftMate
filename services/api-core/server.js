const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
const app = express();
const port = process.env.PORT || 3000;
const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    service: 'ShiftMate API Core',
    status: 'Running',
    version: '1.0.0',
    ai_service_url: aiUrl,
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      bookings: '/api/bookings',
      ai_detect: '/api/ai/detect'
    }
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      database: 'connected',
      ai_service: aiUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, password, name, phone, role = 'customer' } = req.body;
    
    const user = await prisma.user.create({
      data: {
        email,
        password, // In production, hash this password
        name,
        phone,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bookings endpoints
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, pickupAddress, dropoffAddress, distance, scheduledDate, items = [] } = req.body;
    
    const booking = await prisma.booking.create({
      data: {
        userId,
        pickupAddress,
        dropoffAddress,
        distance,
        scheduledDate: new Date(scheduledDate),
        items: {
          create: items.map(item => ({
            name: item.name,
            category: item.category,
            volume: item.volume,
            quantity: item.quantity || 1,
            confidence: item.confidence
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: true
      }
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Integration endpoint
app.post('/api/ai/detect', async (req, res) => {
  try {
    const { imageUrl, bookingRef } = req.body;
    
    // Forward request to AI service
    const response = await fetch(`${aiUrl}/api/v1/ai/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        booking_ref: bookingRef
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI service responded with status: ${response.status}`);
    }
    
    const aiResult = await response.json();
    res.json(aiResult);
  } catch (error) {
    res.status(500).json({ 
      error: 'AI detection failed', 
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl 
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 ShiftMate API Core running at http://localhost:${port}`);
  console.log(`📊 Database: SQLite (dev.db)`);
  console.log(`🤖 AI Service: ${aiUrl}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   GET  /api/users - List users`);
  console.log(`   POST /api/users - Create user`);
  console.log(`   GET  /api/bookings - List bookings`);
  console.log(`   POST /api/bookings - Create booking`);
  console.log(`   POST /api/ai/detect - AI object detection`);
});
