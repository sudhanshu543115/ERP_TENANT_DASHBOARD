SUPER ADMIN      -  mt-superadmin.vercel.app/
TENANT DASHBOARD - erp-tenant-dashboard.vercel.app




BT ERP BACKEND             ----     https://github.com/sudhanshu543115/ERP_BACKEND
BT ERP TENANT FRONTEND     ----     https://github.com/sudhanshu543115/ERP_TENANT_DASHBOARD
BT ERP SUPERADMIN FRONTEND ----     https://github.com/sudhanshu543115/ERP_FRONTEND








📋 Overview
The BT-ERP Backend is a comprehensive multi-tenant ERP system built with Node.js, Express, and Prisma. It features a sophisticated routing architecture with role-based access control, subscription management, and modular design.



🏗️ Architecture Overview
🔧 Technology Stack


// Core Technologies
- Node.js (ES Modules)
- Express.js 5.2.1
- Prisma ORM 5.22.0
- JWT Authentication
- Cookie-based sessions
- Cloudinary (file uploads)
- Razorpay (payments)

// Development Tools
- Nodemon (development)
- ESLint (code quality)





📁 Project Structure

BT-ERP-Backend/
├── src/
│   ├── app.js                    # Main Express app configuration
│   ├── server.js                 # Server entry point (MISSING)
│   ├── core/
│   │   ├── config/              # Environment & database config
│   │   ├── middlewares/         # Custom middleware functions
│   │   ├── cache/              # Permission caching system
│   │   └── utils/              # Utility functions
│   └── modules/
│       ├── admin/              # Super admin functionality
│       ├── audit/              # Audit logging
│       ├── me/                 # User profile management
│       └── featuresa_available/ # Tenant features
├── prisma/                      # Database schema & migrations
└── uploads/                     # File upload storage




🛣️ Routing Architecture
🎯 Main Route Structure


// Base API Version
const API_V1 = "/api/v1";

// Route Hierarchy
/api/v1/
├── super-admin/           # Platform-level admin routes
├── auth/                  # Global authentication
├── subscription-payment/  # Payment processing
└── tenant/:tenantName/    # Tenant-specific routes


🔐 Authentication Flow


// Authentication Methods
1. Cookie-based (primary)
2. Bearer Token (fallback)

// Middleware Chain
authMiddleware → checkSubscription → requirePermission → checkDomainInPlan





👑 Super Admin Routes
🎛️ Platform Management



// Authentication & Users
/api/v1/super-admin/auth              # Login/Management
/api/v1/super-admin/tenants           # Tenant CRUD
/api/v1/super-admin/platform-staff    # Staff management

// Features & Permissions
/api/v1/super-admin/features          # Feature management
/api/v1/super-admin/features/domain   # Feature domains
/api/v1/super-admin/platform-roles    # Role management
/api/v1/super-admin/permissions       # Permission CRUD

// System Management
/api/v1/super-admin/dashboard         # Platform dashboard
/api/v1/audit-logs                    # Audit trails
/api/v1/super-admin/modules           # Module management
/api/v1/super-admin/subscription      # Subscription plans





🏫 Tenant Routes (Dynamic)
🔗 Tenant Router Structure


// Base tenant route
/api/v1/tenant/:tenantName/

// Sub-routes (protected by middleware)
├── me                    # User profile
├── roles                 # Role management
├── features              # Feature access
├── users                 # User management
├── students              # Student management
├── teachers              # Teacher management
├── examination-portal    # Exam management
├── libraries             # Library management
├── attendance            # Attendance tracking
├── classes               # Class management
├── tenant-settings       # Tenant settings
├── tenant/branding       # Branding customization
├── dashboard             # Tenant dashboard
├── sidebar               # Sidebar configuration
└── audit                 # Tenant audit logs




🔒 Middleware Stack Analysis
1. 🍪 Authentication Middleware

   // authMiddleware.js Features
- Cookie-based authentication (primary)
- Bearer token fallback
- JWT token verification
- Multi-user type support:
  * SUPER_ADMIN
  * PLATFORM_STAFF
  * TENANT_ADMIN
  * TENANT_USER
 
- 

2. 💳 Subscription Middleware

   
// checkSubscription.js Features
- Validates tenant subscription status
- Checks subscription plan validity
- Blocks inactive tenants
- Applied to all tenant routes



3. 🎭 Permission Middleware

   // requirePermission() Features
- Role-based access control (RBAC)
- Permission caching system
- Bypass for admin roles
- Granular permission checks



4. 🏛️ Domain Feature Middleware
   // checkDomainInPlan() Features
- Validates feature access based on subscription
- Domain-specific feature checking
- Subscription plan validation
- Prevents unauthorized feature usage


  
📚 Feature-Specific Routes
🎓 Examination Portal

// Base: /api/v1/tenant/:tenantName/examination-portal
POST   /                    # Create exam
GET    /class/:classId      # List exams by class
PUT    /:id                 # Update exam
DELETE /:id                 # Delete exam

// Schedule Management
POST   /:examId/schedule    # Create exam schedule
GET    /:examId/schedule    # Get exam datesheet
PUT    /schedule/:id        # Update schedule
DELETE /schedule/:id        # Delete schedule



🏫 Class Management

// Base: /api/v1/tenant/:tenantName/classes
POST   /                    # Create class
GET    /                    # List classes
GET    /:id                 # Get class details
PUT    /:id                 # Update class
DELETE /:id                 # Delete class
GET    /:id/exams           # Get exams by class



🔧 Configuration Analysis
⚙️ Environment Setup


// .env Configuration (Protected by .gitignore)
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
DIRECT_DATABASE_URL=postgresql://...
JWT_SECRET=supersecret
CORS_ORIGINS=*


🗄️ Database Configuration

// Prisma Setup
- PostgreSQL database
- Multi-tenant architecture
- Role-based permissions
- Subscription management
- Audit logging



🚨 Critical Issues & Gaps
1. ❌ Missing Server Entry Point

   
// Problem: package.json references "src/server.js" but file doesn't exist
"main": "src/server.js",
"start": "node src/server.js",
"dev": "nodemon src/server.js"

// Impact: Server cannot start



Authentication: JWT token validation
Authorization: Role-based permissions
Subscription: Active subscription check
Feature Access: Domain-based feature validation
Tenant Isolation: Route-based tenant separation














🌐 Platform (Super Admin)
├── 👑 SuperAdmin
├── 👥 PlatformStaff
├── 📦 Subscription Plans
└── 🏫 Tenants (Multi-Instance)
    ├── 👤 Tenant Users
    ├── 🎓 Students
    ├── 👨‍🏫 Teachers
    ├── 📚 Classes
    ├── 📝 Examinations
    ├── 📖 Libraries
    └── 📊 Attendance








    🌐 Platform Level
├── 👑 SuperAdmin (Power: 1000)
├── 👥 PlatformStaff (Power: 500)
└── 📦 Subscription Plans
    └── 🏫 Tenant (Power: 100)
        ├── 👤 Tenant Users
        ├── 🎓 Students
        ├── 👨‍🏫 Teachers
        ├── 📚 Classes
        │   ├── 📝 Examinations
        │   │   └── 📅 Exam Schedules
        │   └── 🎓 Students
        ├── 📖 Libraries
        │   └── 📚 Books
        │       └── 📋 Book Assignments
        └── 📊 Attendance









        🔐 Authentication Flow
├── 🍪 Cookie-based (Primary)
├── 🎫 Bearer Token (Fallback)
└── 🔑 JWT Validation

🛡️ Authorization Layers
├── 👑 Super Admin (Full Access)
├── 👥 Platform Staff (Platform Management)
├── 🏫 Tenant Admin (Tenant Management)
└── 👤 Tenant Users (Limited Access)







🔐 Authentication Flow
├── 🍪 Cookie-based (Primary)
├── 🎫 Bearer Token (Fallback)
└── 🔑 JWT Validation

🛡️ Authorization Layers
├── 👑 Super Admin (Full Access)
├── 👥 Platform Staff (Platform Management)
├── 🏫 Tenant Admin (Tenant Management)
└── 👤 Tenant Users (Limited Access)









📊 Database Relationships Summary
🔗 Primary Relationships
Tenant → Users (1:N)
Tenant → Classes (1:N)
Class → Students (1:N)
Class → Examinations (1:N)
Examination → ExamSchedules (1:N)
Tenant → Libraries (1:N)
Library → Books (1:N)
Book → BookAssignments (1:N)
🔒 Security Relationships
SuperAdmin → AuditLogs (1:N)
User → AuditLogs (1:N)
Tenant → AuditLogs (1:N)
💳 Subscription Relationships
Subscription_Plan → Tenants (1:N)
Subscription_Plan → Subscription_Plan_Domain (1:N)
TenantFeatureDomain → Features (M:N)
🎯 Architecture Benefits
✅ Multi-Tenant Isolation
Complete data separation per tenant
Shared infrastructure with isolated data
Scalable for multiple organizations
🔒 Security-First Design
Role-based access control (RBAC)
Audit logging for all actions
Subscription-based feature access
💰 Flexible Subscription Model
Feature-based pricing
Domain-specific access control
Dependency management between features
📈 Scalability
Hierarchical data organization
Efficient indexing strategies
Optimized query patterns
This hierarchy provides a robust foundation for a multi-tenant ERP system with comprehensive security, audit capabilities, and flexible subscription management.











1. 👑 Super Admin Onboarding
mermaid


<img width="589" height="520" alt="image" src="https://github.com/user-attachments/assets/aab2ae57-dd40-400d-8dad-62766a8777e0" />

<img width="634" height="490" alt="image" src="https://github.com/user-attachments/assets/2eb13ef2-e283-46a9-9729-c064deaccdc8" />

<img width="707" height="545" alt="image" src="https://github.com/user-attachments/assets/4c230410-0db2-4658-bb65-b34dd48fbf60" />

<img width="707" height="543" alt="image" src="https://github.com/user-attachments/assets/71d652a6-b54f-444e-883a-cb54e64c0f81" />

<img width="693" height="548" alt="image" src="https://github.com/user-attachments/assets/edae67be-5cf8-45d9-9548-32df666b6a3f" />
<img width="714" height="556" alt="image" src="https://github.com/user-attachments/assets/709354ef-63c4-4299-b564-5c1f9850ab94" />

<img width="701" height="551" alt="image" src="https://github.com/user-attachments/assets/aad3117c-135e-42e5-9cf2-56d268427a11" />

<img width="713" height="546" alt="image" src="https://github.com/user-attachments/assets/0b17d0c2-2b6a-4b27-842c-374801a42710" />


<img width="707" height="527" alt="image" src="https://github.com/user-attachments/assets/33a28631-1057-49f9-9efb-0cdca36c4606" />



🎯 Complete Implementation Steps
Phase 1: Platform Setup
Database Initialization
Run Prisma migrations
Seed Super Admin account
Create subscription plans
Configure feature domains
Platform Configuration
Set up environment variables
Configure CORS settings
Initialize authentication system
Phase 2: Tenant Onboarding
Tenant Registration
Create tenant account
Assign subscription plan
Configure tenant settings
Initial Setup
Create admin roles
Set up permissions
Configure branding
Phase 3: Educational Modules
Class Management
Create class structure
Assign students to classes
Set up academic years
Examination System
Create examination types
Set up exam schedules
Configure grading systems
Library Management
Create library structure
Add books with metadata
Set up assignment system
Phase 4: User Management
User Creation
Add teachers and staff
Create student accounts
Assign roles and permissions
Access Control
Configure role-based access
Set up feature restrictions
Implement audit logging
📋 Quick Copy-Paste Implementation Checklist
✅ Database Setup
bash
# 1. Install dependencies
npm install
 
# 2. Generate Prisma client
npx prisma generate
 
# 3. Run migrations
npx prisma migrate dev
 
# 4. Seed database
npm run seed
✅ Environment Configuration
bash
# Create .env file
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/erp_db
JWT_SECRET=your-super-secret-key
CORS_ORIGINS=http://localhost:5173,http://localhost:5173
✅ Server Start
bash
# Development
npm run dev
 
# Production
npm run start
✅ API Endpoints Structure
Platform Admin:
POST   /api/v1/super-admin/auth/login
GET    /api/v1/super-admin/tenants
POST   /api/v1/super-admin/tenants
GET    /api/v1/super-admin/subscription
 
Tenant Management:
POST   /api/v1/auth/tenant/login
POST   /api/v1/auth/tenant/register
GET    /api/v1/tenant/:tenantName/me
 
Educational Modules:
GET    /api/v1/tenant/:tenantName/classes
POST   /api/v1/tenant/:tenantName/classes
GET    /api/v1/tenant/:tenantName/examination-portal
POST   /api/v1/tenant/:tenantName/examination-portal
GET    /api/v1/tenant/:tenantName/libraries
POST   /api/v1/tenant/:tenantName/libraries































    





