# ShiftMate - Sprint Plan & Development Roadmap

## 📋 Project Overview
ShiftMate is a comprehensive movers and packers platform with AI-powered item detection, customer booking management, and admin operations dashboard.

---

## 🎯 Git Branching Strategy

### Main Branches
- **`main`** (or `master`) - Production-ready code
- **`develop`** - Integration branch for features

### Sprint/Feature Branches
Each sprint will have its own branch following the naming convention:
- `sprint-1-ai-model`
- `sprint-2-database-schema`
- `sprint-3-api-core`
- etc.

### Workflow
1. Create sprint branch from `main`/`master`
2. Develop and test features in sprint branch
3. Merge sprint branch back to `main`/`master` when complete
4. Tag the merge with sprint version (e.g., `v1.0-sprint1`)

---

## 🚀 Sprint Breakdown

### **Sprint 0: Project Setup & Infrastructure** ✅ (COMPLETED)
**Branch**: `master` (initial commit)
**Duration**: 1 week

#### Deliverables:
- [x] Docker Compose configuration
- [x] Service structure (api-core, ai-model)
- [x] Basic service dockerfiles
- [x] Project scaffolding

---

### **Sprint 1: AI Model Service - Object Detection** 🤖
**Branch**: `sprint-1-ai-model`
**Duration**: 2-3 weeks
**Priority**: HIGH

#### Goals:
Implement real AI/ML model for detecting furniture and household items from images

#### Tasks:
1. **Model Selection & Setup**
   - [ ] Research and select object detection model (YOLO v8, ResNet, or EfficientDet)
   - [ ] Set up model training environment
   - [ ] Prepare dataset for furniture/household items

2. **Core AI Functionality**
   - [ ] Implement image preprocessing pipeline
   - [ ] Integrate object detection model
   - [ ] Add volume estimation logic based on object dimensions
   - [ ] Implement item classification (fragile vs non-fragile)
   - [ ] Add confidence scores for detections

3. **API Endpoints**
   - [ ] `POST /api/v1/ai/detect` - Upload images and detect items
   - [ ] `POST /api/v1/ai/detect-batch` - Process multiple images
   - [ ] `GET /api/v1/ai/supported-items` - List detectable items
   - [ ] `GET /api/v1/ai/health` - Service health check

4. **Data Models**
   - [ ] Create item catalog database
   - [ ] Define volume calculation rules
   - [ ] Create response schemas

5. **Testing**
   - [ ] Unit tests for detection logic
   - [ ] Integration tests for API endpoints
   - [ ] Load testing for image processing

#### Dependencies:
- TensorFlow/PyTorch
- OpenCV
- Pillow
- NumPy

#### Acceptance Criteria:
- AI service can detect at least 50+ common household items
- Accuracy > 80% on test dataset
- Processing time < 5 seconds per image
- Proper error handling for invalid images

---

### **Sprint 2: Database Schema & Models** 🗄️
**Branch**: `sprint-2-database-schema`
**Duration**: 1-2 weeks
**Priority**: HIGH

#### Goals:
Design and implement complete database schema for the application

#### Tasks:
1. **Schema Design**
   - [ ] Design ER diagram
   - [ ] Define all tables and relationships
   - [ ] Plan indexes and constraints

2. **Core Tables**
   - [ ] Users table (customers, movers, admins)
   - [ ] Bookings table
   - [ ] Items catalog table
   - [ ] Detected items table
   - [ ] Addresses table
   - [ ] Pricing table
   - [ ] Reviews/Ratings table
   - [ ] Payments table

3. **Migration Setup**
   - [ ] Set up database migration tool (e.g., Sequelize, TypeORM, or raw SQL)
   - [ ] Create initial migration scripts
   - [ ] Add seed data for testing

4. **Database Documentation**
   - [ ] Document schema
   - [ ] Create sample queries
   - [ ] Write migration guide

#### Acceptance Criteria:
- All tables created with proper relationships
- Sample data seeded successfully
- Migration scripts run without errors

---

### **Sprint 3: API Core - Authentication & User Management** 👥
**Branch**: `sprint-3-api-authentication`
**Duration**: 2 weeks
**Priority**: HIGH

#### Goals:
Implement user authentication, authorization, and user management

#### Tasks:
1. **Authentication System**
   - [ ] JWT token implementation
   - [ ] User registration endpoint
   - [ ] User login endpoint
   - [ ] Password hashing (bcrypt)
   - [ ] Refresh token mechanism
   - [ ] Password reset flow

2. **User Management**
   - [ ] Get user profile
   - [ ] Update user profile
   - [ ] Delete user account
   - [ ] User roles (Customer, Mover, Admin)

3. **Middleware**
   - [ ] Authentication middleware
   - [ ] Authorization middleware (role-based)
   - [ ] Request validation middleware
   - [ ] Error handling middleware

4. **Security**
   - [ ] Rate limiting
   - [ ] CORS configuration
   - [ ] Input sanitization
   - [ ] SQL injection prevention

#### API Endpoints:
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/profile
```

#### Acceptance Criteria:
- Secure authentication system working
- Role-based access control implemented
- All endpoints properly secured

---

### **Sprint 4: API Core - Booking Management** 📦
**Branch**: `sprint-4-api-bookings`
**Duration**: 2-3 weeks
**Priority**: HIGH

#### Goals:
Implement complete booking lifecycle management

#### Tasks:
1. **Booking Creation**
   - [ ] Create booking endpoint
   - [ ] Validate booking details
   - [ ] Store detected items from AI
   - [ ] Calculate initial pricing

2. **Booking Management**
   - [ ] Get booking by ID
   - [ ] List user bookings
   - [ ] Update booking details
   - [ ] Cancel booking
   - [ ] Booking status workflow

3. **AI Integration**
   - [ ] Call AI service for item detection
   - [ ] Store detected items in database
   - [ ] Handle AI service errors gracefully

4. **Business Logic**
   - [ ] Pricing calculation algorithm
   - [ ] Distance calculation
   - [ ] Vehicle selection logic
   - [ ] Worker allocation logic
   - [ ] Time slot management

5. **Notifications**
   - [ ] Email notifications (booking confirmation, updates)
   - [ ] SMS notifications (optional)

#### API Endpoints:
```
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
POST   /api/bookings/:id/detect-items
GET    /api/bookings/:id/items
PUT    /api/bookings/:id/status
GET    /api/bookings/:id/pricing
```

#### Acceptance Criteria:
- Complete booking CRUD operations
- AI service integration working
- Pricing calculation accurate
- Email notifications sent

---

### **Sprint 5: API Core - Admin Features** 👨‍💼
**Branch**: `sprint-5-api-admin`
**Duration**: 2 weeks
**Priority**: MEDIUM

#### Goals:
Implement admin dashboard backend functionality

#### Tasks:
1. **Dashboard Analytics**
   - [ ] Get booking statistics
   - [ ] Revenue reports
   - [ ] User analytics
   - [ ] Service performance metrics

2. **Booking Management**
   - [ ] View all bookings
   - [ ] Assign movers to bookings
   - [ ] Update booking status
   - [ ] Handle disputes

3. **User Management**
   - [ ] View all users
   - [ ] Activate/deactivate users
   - [ ] Assign roles
   - [ ] View user activity

4. **Pricing Management**
   - [ ] Update base pricing
   - [ ] Manage surge pricing
   - [ ] Create discount codes
   - [ ] Set delivery zones and rates

#### API Endpoints:
```
GET    /api/admin/dashboard/stats
GET    /api/admin/bookings
PUT    /api/admin/bookings/:id/assign
GET    /api/admin/users
PUT    /api/admin/users/:id/status
GET    /api/admin/pricing
PUT    /api/admin/pricing
POST   /api/admin/discounts
```

#### Acceptance Criteria:
- Admin can view all system data
- Admin can manage bookings and users
- Analytics dashboard data available

---

### **Sprint 6: Customer Web App** 🌐
**Branch**: `sprint-6-customer-frontend`
**Duration**: 3-4 weeks
**Priority**: HIGH

#### Goals:
Build customer-facing web application

#### Tasks:
1. **Setup & Configuration**
   - [ ] Choose framework (React/Vue/Next.js)
   - [ ] Set up routing
   - [ ] Configure API client
   - [ ] Set up state management

2. **Authentication Pages**
   - [ ] Login page
   - [ ] Registration page
   - [ ] Password reset page
   - [ ] Profile page

3. **Booking Flow**
   - [ ] Create booking form
   - [ ] Image upload component
   - [ ] Item detection display
   - [ ] Pricing calculator
   - [ ] Payment integration UI
   - [ ] Booking confirmation

4. **User Dashboard**
   - [ ] View bookings list
   - [ ] View booking details
   - [ ] Track booking status
   - [ ] Cancel booking
   - [ ] Rate and review

5. **UI/UX**
   - [ ] Responsive design
   - [ ] Loading states
   - [ ] Error handling
   - [ ] Toast notifications

#### Tech Stack Suggestion:
- React.js with TypeScript
- Tailwind CSS or Material-UI
- React Query for API calls
- React Router for navigation
- Axios for HTTP requests

#### Acceptance Criteria:
- User can register and login
- User can create and manage bookings
- Image upload and AI detection working
- Responsive on mobile and desktop

---

### **Sprint 7: Admin Web App** 👨‍💻
**Branch**: `sprint-7-admin-frontend`
**Duration**: 3 weeks
**Priority**: MEDIUM

#### Goals:
Build admin dashboard web application

#### Tasks:
1. **Dashboard Overview**
   - [ ] Statistics cards
   - [ ] Revenue charts
   - [ ] Recent bookings list
   - [ ] User activity feed

2. **Booking Management**
   - [ ] Bookings table with filters
   - [ ] Booking details view
   - [ ] Assign movers
   - [ ] Update status

3. **User Management**
   - [ ] Users table
   - [ ] User details view
   - [ ] Role management
   - [ ] Activity logs

4. **Configuration**
   - [ ] Pricing settings
   - [ ] Discount codes management
   - [ ] Item catalog management
   - [ ] System settings

5. **Reports**
   - [ ] Revenue reports
   - [ ] Booking reports
   - [ ] User reports
   - [ ] Export functionality

#### Acceptance Criteria:
- Admin can view analytics
- Admin can manage all bookings and users
- Reports can be generated and exported

---

### **Sprint 8: Payment Integration** 💳
**Branch**: `sprint-8-payment-integration`
**Duration**: 2 weeks
**Priority**: HIGH

#### Goals:
Integrate payment gateway for booking payments

#### Tasks:
1. **Payment Gateway Setup**
   - [ ] Choose payment provider (Stripe/Razorpay/PayPal)
   - [ ] Set up API keys
   - [ ] Create payment service

2. **Backend Integration**
   - [ ] Create payment endpoints
   - [ ] Handle payment callbacks
   - [ ] Store payment records
   - [ ] Refund logic

3. **Frontend Integration**
   - [ ] Payment form component
   - [ ] Payment status display
   - [ ] Receipt generation

4. **Security**
   - [ ] PCI compliance
   - [ ] Secure payment data handling
   - [ ] Webhook verification

#### Acceptance Criteria:
- Users can make payments
- Payment status tracked correctly
- Refunds can be processed
- Receipts generated

---

### **Sprint 9: Testing & Quality Assurance** 🧪
**Branch**: `sprint-9-testing`
**Duration**: 2 weeks
**Priority**: HIGH

#### Goals:
Comprehensive testing of entire application

#### Tasks:
1. **Backend Testing**
   - [ ] Unit tests for all services
   - [ ] Integration tests for APIs
   - [ ] E2E tests for critical flows
   - [ ] Load testing
   - [ ] Security testing

2. **Frontend Testing**
   - [ ] Component tests
   - [ ] Integration tests
   - [ ] E2E tests with Cypress/Playwright
   - [ ] Cross-browser testing

3. **Performance Testing**
   - [ ] API response time optimization
   - [ ] Frontend bundle size optimization
   - [ ] Image optimization
   - [ ] Database query optimization

4. **Documentation**
   - [ ] API documentation (Swagger/OpenAPI)
   - [ ] User guide
   - [ ] Admin guide
   - [ ] Developer documentation

#### Acceptance Criteria:
- Test coverage > 80%
- All critical bugs fixed
- Performance benchmarks met
- Documentation complete

---

### **Sprint 10: Deployment & DevOps** 🚀
**Branch**: `sprint-10-deployment`
**Duration**: 1-2 weeks
**Priority**: HIGH

#### Goals:
Deploy application to production

#### Tasks:
1. **CI/CD Pipeline**
   - [ ] Set up GitHub Actions/GitLab CI
   - [ ] Automated testing
   - [ ] Automated deployment
   - [ ] Environment variables management

2. **Cloud Infrastructure**
   - [ ] Choose cloud provider (AWS/Azure/GCP)
   - [ ] Set up containers (ECS/AKS/GKE)
   - [ ] Configure load balancer
   - [ ] Set up CDN

3. **Database**
   - [ ] Production database setup
   - [ ] Backup strategy
   - [ ] Migration scripts

4. **Monitoring**
   - [ ] Application monitoring (New Relic/Datadog)
   - [ ] Log aggregation (ELK Stack)
   - [ ] Error tracking (Sentry)
   - [ ] Uptime monitoring

5. **Security**
   - [ ] SSL certificates
   - [ ] Environment secrets
   - [ ] Security scanning
   - [ ] Backup and disaster recovery

#### Acceptance Criteria:
- Application deployed and accessible
- CI/CD pipeline working
- Monitoring in place
- Backup strategy implemented

---

## 📊 Sprint Timeline

```
Sprint 0: Week 1                              ✅ DONE
Sprint 1: Week 2-4          (AI Model)        🚀 START HERE
Sprint 2: Week 5-6          (Database)
Sprint 3: Week 7-8          (Auth & Users)
Sprint 4: Week 9-11         (Bookings)
Sprint 5: Week 12-13        (Admin API)
Sprint 6: Week 14-17        (Customer App)
Sprint 7: Week 18-20        (Admin App)
Sprint 8: Week 21-22        (Payments)
Sprint 9: Week 23-24        (Testing)
Sprint 10: Week 25-26       (Deployment)
```

**Total Duration**: ~26 weeks (6-7 months)

---

## 🎯 Priority Matrix

### Must Have (MVP)
- Sprint 1: AI Model
- Sprint 2: Database Schema
- Sprint 3: Authentication
- Sprint 4: Booking Management
- Sprint 6: Customer Web App

### Should Have
- Sprint 5: Admin Features
- Sprint 7: Admin Web App
- Sprint 8: Payment Integration

### Nice to Have
- Advanced analytics
- Mobile apps
- Real-time tracking
- Chat support

---

## 📝 Git Commands for Sprint Workflow

### Starting a Sprint:
```bash
# Ensure you're on main/master and up to date
git checkout master
git pull origin master

# Create sprint branch
git checkout -b sprint-1-ai-model

# Start working...
```

### During Sprint:
```bash
# Regular commits
git add .
git commit -m "feat: implement object detection endpoint"

# Push to remote
git push origin sprint-1-ai-model
```

### Completing a Sprint:
```bash
# Ensure branch is up to date
git add .
git commit -m "feat: complete AI model implementation"
git push origin sprint-1-ai-model

# Merge to master
git checkout master
git pull origin master
git merge sprint-1-ai-model

# Tag the release
git tag -a v1.0-sprint1 -m "Sprint 1: AI Model Complete"
git push origin master --tags

# Optional: Delete sprint branch
git branch -d sprint-1-ai-model
git push origin --delete sprint-1-ai-model
```

---

## 📌 Next Steps

1. **Commit current work to master**
2. **Create sprint-1-ai-model branch**
3. **Start implementing AI model features**
4. **Follow the sprint plan sequentially**

---

## 🤝 Contributing Guidelines

- Follow commit message conventions (feat:, fix:, docs:, refactor:, test:)
- Write meaningful commit messages
- Keep commits atomic and focused
- Test before committing
- Update documentation with changes

---

**Last Updated**: October 21, 2025
**Project Status**: Sprint 0 Complete, Ready for Sprint 1
