const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { PrismaClient } = require('./generated/prisma');
const app = express();
const port = process.env.PORT || 3000;
const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Initialize Prisma client
const prisma = new PrismaClient();

// Configure multer for memory storage (file uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

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

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user with password field
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Direct password comparison (plaintext for now)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, role = 'CLIENT' } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        phone,
        role
      }
    });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// AI Integration endpoint - proxy file upload to AI service
app.post('/api/ai/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const bookingRef = req.body.booking_ref || req.body.bookingRef;
    
    // Create FormData to forward to AI service
    const formData = new FormData();
    
    // Add image file as a buffer stream
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    
    // Add booking reference if provided
    if (bookingRef) {
      formData.append('booking_ref', bookingRef);
    }
    
    // Forward request to AI service using axios
    const response = await axios.post(`${aiUrl}/api/v1/ai/detect`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('AI Detection Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'AI detection failed', 
      details: error.response?.data?.detail || error.message 
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
  console.log(`   POST /api/auth/login - User login`);
  console.log(`   POST /api/auth/register - User registration`);
  console.log(`   GET  /api/users - List users`);
  console.log(`   POST /api/users - Create user`);
  console.log(`   GET  /api/bookings - List bookings`);
  console.log(`   POST /api/bookings - Create booking`);
  console.log(`   POST /api/ai/detect - AI object detection`);
});
