# ShiftMate Frontend

Modern, responsive web interface for the ShiftMate AI-powered moving and packing platform.

## 🎨 Features

- **Home Dashboard**: System status overview and quick actions
- **AI Detection**: Upload images for automatic item detection and volume estimation
- **Bookings Management**: View and manage all moving bookings
- **Admin Dashboard**: Complete system overview, user management, and statistics
- **Real-time Updates**: Live status monitoring of all services
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 📁 Structure

```
frontend/
├── index.html              # Home page
├── css/
│   └── main.css           # Global styles and components
├── js/
│   └── api.js             # API client and utility functions
└── pages/
    ├── upload.html        # New booking with AI detection
    ├── bookings.html      # View all bookings
    └── admin.html         # Admin dashboard
```

## 🚀 Running the Frontend

### Option 1: Using Python HTTP Server (Recommended)

From the root directory:
```bash
python serve_frontend.py
```
Then open: http://localhost:8080/index.html

### Option 2: Using PowerShell to Start All Services

From the root directory:
```powershell
.\start_shiftmate.ps1
```
This will start:
- Frontend on port 8080
- API Core on port 3000
- AI Service on port 8000

### Option 3: Using Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🔧 Configuration

The API endpoints are configured in `js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
const AI_API_URL = 'http://localhost:8000/api/v1/ai';
```

Update these if your services run on different ports.

## 📖 Pages Overview

### Home (`index.html`)
- System health status
- Quick navigation cards
- Recent bookings preview
- Feature highlights

### Upload/New Booking (`pages/upload.html`)
- **Step 1**: Upload item image with drag-and-drop support
- **Step 2**: Review AI detection results
- **Step 3**: Enter booking details and confirm
- Real-time AI processing with loading indicators

### Bookings (`pages/bookings.html`)
- View all bookings in a table
- Search by customer name, email, or address
- Filter by status (pending, confirmed, completed, etc.)
- Detailed booking view modal
- Statistics dashboard

### Admin Dashboard (`pages/admin.html`)
- Overall system statistics
- System health monitoring (API, AI, Database)
- User management table
- Recent bookings overview
- AI model status
- Complete catalog of supported items by category

## 🎨 Styling

The design system uses:
- **Primary Color**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#4ade80)
- **Warning**: Yellow (#fbbf24)
- **Danger**: Red (#ef4444)
- **Components**: Cards, buttons, forms, badges, tables, stats, modals
- **Typography**: System font stack for optimal readability

## 🔌 API Integration

The frontend communicates with two backend services:

### API Core (Port 3000)
- `GET /api/health` - Health check
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking

### AI Service (Port 8000)
- `GET /api/v1/ai/health` - AI health check
- `POST /api/v1/ai/detect` - Detect objects from image
- `GET /api/v1/ai/supported-items` - List supported items

## 📱 Responsive Design

- **Desktop**: Full-width tables and multi-column grids
- **Tablet**: 2-column layouts adapt to single column
- **Mobile**: Stacked layouts, optimized touch targets

## 🔒 Security Notes

⚠️ **Development Mode**: This frontend is configured for development with:
- No authentication required
- CORS enabled for all origins
- Local storage for user data
- Temporary user creation

**For Production**:
- Implement proper authentication (JWT, OAuth)
- Add input validation and sanitization
- Use HTTPS for all API calls
- Implement rate limiting
- Add proper error boundaries
- Enable security headers (CSP, HSTS, etc.)

## 🎯 Key Features

### Image Upload
- Drag and drop support
- File type validation (JPG, PNG)
- Size limit enforcement (10MB)
- Live preview before detection

### AI Detection
- Real-time processing feedback
- Confidence scores for each item
- Volume calculations
- Fragility indicators
- Bounding box visualization

### Booking Creation
- Multi-step form wizard
- Auto-save user information
- Date/time picker for scheduling
- Address validation
- Distance calculation

### Search & Filter
- Real-time search across bookings
- Status-based filtering
- Debounced search for performance

## 🐛 Troubleshooting

**Services not connecting?**
- Check that all three services are running
- Verify ports 3000, 8000, and 8080 are not blocked
- Check browser console for CORS errors

**AI Detection failing?**
- Ensure AI service is fully loaded (check model loading)
- Verify image format (JPG/PNG only)
- Check image size (under 10MB)

**Bookings not showing?**
- Verify database is connected (check API health)
- Check browser console for errors
- Try refreshing the page

## 📚 Additional Resources

- [Backend API Documentation](../services/api-core/README.md)
- [AI Service Documentation](../services/ai-model/README.md)
- [Development Guide](../DEVELOPMENT_GUIDE.md)

## 🤝 Contributing

When adding new features:
1. Follow the existing component structure
2. Use the defined color scheme and utilities
3. Ensure mobile responsiveness
4. Add error handling
5. Update this README

## 📝 License

Part of the ShiftMate project.
