
# ClinicSystem 🏥

A comprehensive full-stack web application for managing a women's gynecology and obstetrics clinic. Built with modern technologies to provide efficient patient care management, appointment scheduling, and administrative operations.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [User Roles & Permissions](#user-roles--permissions)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

ClinicSystem is designed specifically for women's healthcare facilities, providing a complete digital solution for managing:
- Patient records and medical histories
- Appointment scheduling and management
- Doctor-patient assignments
- Administrative tasks and user management
- Real-time statistics and reporting

The system supports three main user roles (Admin, Receptionist, Doctor) with role-based access control and tailored interfaces.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with secure token management
- Role-based access control (RBAC)
- Automatic token refresh and session management
- Password hashing with BCrypt
- CORS configuration for secure cross-origin requests

### 👥 User Management
- **Admin Role**: Full system access, user creation, and management
- **Receptionist Role**: Patient and appointment management
- **Doctor Role**: Access to assigned patients and appointments
- User profile management and role assignment

### 👩‍⚕️ Patient Management
- Comprehensive patient registration with medical details
- Patient search and filtering capabilities
- Medical history tracking (gynecological, obstetric, antenatal)
- Emergency contact information
- Doctor-patient assignment system
- Patient detail views with complete medical records

### 📅 Appointment System
- Interactive appointment scheduling with date/time selection
- Real-time availability checking
- Appointment status management (Scheduled, Completed, Cancelled)
- Doctor-specific appointment views
- Appointment history and tracking
- Calendar integration with visual indicators

### 🏥 Doctor Management
- Doctor profile management with specializations
- Schedule management and availability
- Patient assignment and tracking
- Performance statistics and reporting

### 📊 Dashboard & Analytics
- Role-specific dashboards with relevant metrics
- Live statistics (today's appointments, pending tasks, patient counts)
- Interactive calendar with appointment visualization
- Quick action buttons for common tasks
- Real-time data updates

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- Mobile-first approach for accessibility
- Modal forms with enhanced UX using react-select
- Loading states and error handling
- Active page highlighting in navigation
- Fixed header with role display
- Truncated text cells with expandable modals
- Calendar integration with appointment visualization
- Confirmation modals for destructive actions
- Real-time form validation and error messages

## 🛠 Technology Stack

### Backend (.NET 9)
```
**Backend:**
- ASP.NET Core (.NET 9)
- Entity Framework Core 9.0 (with PostgreSQL)
- Npgsql.EntityFrameworkCore.PostgreSQL 9.0.4
- AutoMapper.Extensions.Microsoft.DependencyInjection 12.0.1
- Microsoft.AspNetCore.Authentication.JwtBearer 9.0.7
- BCrypt.Net-Next 4.0.3 (Password hashing)
- Swashbuckle.AspNetCore 6.4.0 (API documentation)
- RESTful API controllers with [Authorize] attributes
```

### Frontend (React 19)
```
**Frontend:**
- React 19.1.0 (with Hooks)
- Vite 7.0.4 (Build tool and dev server)
- React Router DOM 7.7.0 (Client-side routing)
- Tailwind CSS 3.4.3 (Styling framework)
- PostCSS 8.5.6 & Autoprefixer 10.4.21
- Axios 1.11.0 (HTTP client)
- React-Select 5.10.2 (Enhanced dropdowns)
- React-Calendar 6.0.0 (Calendar component)
- BCryptjs 3.0.2 (Client-side password utilities)
- ESLint 9.30.1 (Code linting)
```

### Development Tools
```
- Visual Studio Code
- .NET CLI
- npm/Node.js
- Git version control
- PostgreSQL Management Tools
```

## 🏗 System Architecture

### Backend Architecture
```
┌─────────────────────────────┐    ┌─────────────────────────────┐    ┌─────────────────────────────┐
│        Controllers          │────│           DTOs              │────│          Models             │
│                             │    │                             │    │                             │
│ - AuthController            │    │ - LoginDto                  │    │ - User                      │
│ - UsersController           │    │ - UserDto                   │    │ - Patient                   │
│ - PatientsController        │    │ - PatientDto                │    │ - Doctor                    │
│ - AppointmentsController    │    │ - AppointmentDto            │    │ - Appointment               │
│ - DoctorsController         │    │ - DoctorDto                 │    │ - MedicalRecord             │
│ - MedicalRecordsController  │    │ - MedicalRecordDto          │    │ - GynecologicalHistory      │
│ - GynecologicalController   │    │ - GynecologicalHistoryDto   │    │ - ObstetricHistory          │
│ - ObstetricController       │    │ - ObstetricHistoryDto       │    │ - AntenatalVisit            │
│ - AntenatalVisitsController │    │ - AntenatalVisitDto         │    │ - Prescription              │
│ - PrescriptionsController   │    │ - PrescriptionDto           │    │ - LabTest                   │
│ - LabTestsController        │    │ - LabTestDto                │    │ - Invoice                   │
│ - InvoicesController        │    │ - InvoiceDto                │    │ - Pregnancy                 │
│                             │    │ - FileUploadDto             │    │ - FileUpload                │
│                             │    │ - NotificationDto           │    │ - Notification              │
│                             │    │ - PregnancyDto              │    │                             │
└─────────────────────────────┘    └─────────────────────────────┘    └─────────────────────────────┘
              │                                    │                                    │
              └────────────────────────────────────┼────────────────────────────────────┘
                                                   │
                                     ┌─────────────────────────────┐
                                     │       ClinicDbContext       │
                                     │                             │
                                     │ DbSets:                     │
                                     │ - Users                     │
                                     │ - Patients                  │
                                     │ - Doctors                   │
                                     │ - Appointments              │
                                     │ - MedicalRecords            │
                                     │ - GynecologicalHistories    │
                                     │ - ObstetricHistories        │
                                     │ - AntenatalVisits           │
                                     │ - Prescriptions             │
                                     │ - LabTests                  │
                                     │ - Invoices                  │
                                     │ - Pregnancies               │
                                     │ - FileUploads               │
                                     │ - Notifications             │
                                     └─────────────────────────────┘
                                                   │
                                     ┌─────────────────────────────┐
                                     │       PostgreSQL            │
                                     │        Database             │
                                     │                             │
                                     │ Tables:                     │
                                     │ - users                     │
                                     │ - patients                  │
                                     │ - doctors                   │
                                     │ - appointments              │
                                     │ - medical_records           │
                                     │ - gynecological_histories   │
                                     │ - obstetric_histories       │
                                     │ - antenatal_visits          │
                                     │ - prescriptions             │
                                     │ - lab_tests                 │
                                     │ - invoices                  │
                                     │ - pregnancies               │
                                     │ - file_uploads              │
                                     │ - notifications             │
                                     └─────────────────────────────┘
```

### Frontend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Pages      │────│   Components    │────│     Utils       │
│                 │    │                 │    │                 │
│ - HomePage      │    │ - Spinner       │    │ - auth.js       │
│ - LoginPage     │    │ - Select        │    │ - config.js     │
│ - PatientsPage  │    │ - TruncatedCell │    │                 │
│ - AppointmentsP │    │ - PrivateRoute  │    │                 │
│ - DoctorsPage   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                        ┌─────────────────┐
                        │    App.jsx      │
                        │                 │
                        │ - Routing       │
                        │ - Auth State    │
                        │ - Navigation    │
                        └─────────────────┘
```

## 🗄 Database Schema

### Core Entities

#### Users Table
```sql
- Id (Primary Key)
- Username (Unique)
- Email (Unique)
- PasswordHash
- FirstName
- LastName
- Role (Admin/Receptionist/Doctor)
- CreatedAt
- UpdatedAt
- DoctorId (Foreign Key, nullable)
```

#### Patients Table
```sql
- Id (Primary Key)
- FirstName
- LastName
- DateOfBirth
- Gender
- Phone
- Email
- Address
- MaritalStatus
- EmergencyContactName
- EmergencyContactPhone
- DoctorId (Foreign Key)
- CreatedAt
- UpdatedAt
```

#### Doctors Table
```sql
- Id (Primary Key)
- FirstName
- LastName
- Specialty
- Phone
- Email
- Address
- CreatedAt
- UpdatedAt
```

#### Appointments Table
```sql
- Id (Primary Key)
- AppointmentDateTime
- PatientId (Foreign Key)
- DoctorId (Foreign Key)
- Status (Scheduled/Completed/Cancelled)
- Reason
- Notes
- CreatedBy
- CreatedAt
- UpdatedAt
```

### Medical Records Tables
```sql
- MedicalRecords (diagnosis, symptoms, treatment, medications, allergies)
- GynecologicalHistories (menstrual history, contraceptive use, gynecological issues)
- ObstetricHistories (pregnancy history, deliveries, complications)
- AntenatalVisits (prenatal checkups, weight, blood pressure, fetal heart rate)
- Prescriptions (medications prescribed during appointments)
- LabTests (test results, requested by doctors)
- Invoices (billing information for appointments and services)
- Pregnancies (current pregnancy tracking with due dates)
- FileUploads (patient documents, test results, images)
- Notifications (system notifications for users)
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login          - User login
POST /api/auth/register       - User registration (Admin only)
GET  /api/auth/me            - Get current user info
```

### Users Management
```
GET    /api/users            - Get all users (Admin only)
POST   /api/users            - Create new user (Admin only)
PUT    /api/users/{id}       - Update user (Admin only)
DELETE /api/users/{id}       - Delete user (Admin only)
```

### Patients Management
```
GET    /api/patients                 - Get all patients
GET    /api/patients/{id}           - Get patient by ID
GET    /api/patients/doctor/{id}    - Get patients by doctor
POST   /api/patients               - Create new patient
PUT    /api/patients/{id}          - Update patient
DELETE /api/patients/{id}          - Delete patient
```

### Appointments Management
```
GET    /api/appointments                 - Get all appointments
GET    /api/appointments/{id}           - Get appointment by ID
GET    /api/appointments/doctor/{id}    - Get appointments by doctor
GET    /api/appointments/patient/{id}   - Get appointments by patient
POST   /api/appointments               - Create new appointment
PUT    /api/appointments/{id}          - Update appointment
DELETE /api/appointments/{id}          - Delete appointment
```

### Doctors Management
```
GET    /api/doctors            - Get all doctors
GET    /api/doctors/{id}       - Get doctor by ID
GET    /api/doctors/by-user/{userId} - Get doctor by user ID
POST   /api/doctors            - Create new doctor (Admin only)
PUT    /api/doctors/{id}       - Update doctor
DELETE /api/doctors/{id}       - Delete doctor (Admin only)
```

### Medical Records Management
```
GET    /api/medicalrecords                 - Get all medical records
GET    /api/medicalrecords/{id}           - Get medical record by ID
GET    /api/medicalrecords/patient/{id}   - Get records by patient
POST   /api/medicalrecords               - Create new medical record
PUT    /api/medicalrecords/{id}          - Update medical record
DELETE /api/medicalrecords/{id}          - Delete medical record
```

### Specialized Medical Records
```
GET/POST/PUT/DELETE /api/gynecologicalhistories  - Gynecological history management
GET/POST/PUT/DELETE /api/obstetrichistories      - Obstetric history management
GET/POST/PUT/DELETE /api/antenatalvisits         - Antenatal visit management
GET/POST/PUT/DELETE /api/prescriptions           - Prescription management
GET/POST/PUT/DELETE /api/labtests                - Lab test management
GET/POST/PUT/DELETE /api/invoices                - Invoice management
```

## 👤 User Roles & Permissions

### 🔴 Admin
**Full System Access**
- User management (create, edit, delete users)
- Doctor management (add, edit, remove doctors)
- Patient management (full access)
- Appointment management (full access)
- System statistics and reporting
- All administrative functions

**Navigation Access:**
- Home Dashboard
- Users Management
- Doctors Management
- Patients Management
- Appointments Management

### 🟡 Receptionist
**Front Desk Operations**
- Patient registration and management
- Appointment scheduling and management
- Basic patient information updates
- View doctor information
- Access to daily schedules

**Navigation Access:**
- Home Dashboard
- Patients Management
- Appointments Management
- Doctors List (view only)

### 🟢 Doctor
**Patient Care Focus**
- View assigned patients only
- Manage own appointments
- Update patient medical records
- View own schedule and statistics
- Patient medical history access

**Navigation Access:**
- Home Dashboard
- Doctor Dashboard (personal)
- My Patients
- My Appointments

## 🚀 Installation & Setup

### Prerequisites
- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js (v18+)** - [Download](https://nodejs.org/)
- **PostgreSQL (v13+)** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ClinicSystem.git
cd ClinicSystem
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb gyn_obs_clinic

# Or using PostgreSQL command line
psql -U postgres
CREATE DATABASE "gyn&obs_clinic";
\q
```

### 3. Backend Setup
```bash
# Navigate to API directory
cd ClinicSystem.API

# Restore packages
dotnet restore

# Update connection string in appsettings.json
# ConnectionStrings:DefaultConnection = "Host=localhost;port=5432;Database=gyn&obs_clinic;Username=postgres;password=yourpassword"

# Run database migrations
dotnet ef database update

# Start backend server
dotnet run
```
Backend will run on: `https://localhost:7158` or `http://localhost:5158`

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd clinic-frontend

# Install dependencies
npm install

# Update API base URL in src/config.js if needed
# const API_BASE_URL = "https://localhost:7158/api";

# Start development server
npm run dev
```
Frontend will run on: `http://localhost:5173`

### 5. Initial Data Setup
```bash
# Create initial admin user (run this after first startup)
# Use the API or database directly to create your first admin user
```

## 📖 Usage Guide

### Getting Started
1. **Access the Application**: Navigate to `http://localhost:5173`
2. **Login**: Use your credentials (admin/admin for initial setup)
3. **Dashboard**: View your role-specific dashboard with statistics
4. **Navigation**: Use the header navigation to access different sections

### Admin Workflow
1. **User Management**: Create receptionist and doctor accounts
2. **Doctor Setup**: Add doctor profiles with specializations
3. **System Configuration**: Configure clinic settings and permissions
4. **Monitoring**: Monitor system usage and performance

### Receptionist Workflow
1. **Patient Registration**: Add new patients with complete information
2. **Appointment Scheduling**: Schedule appointments for patients
3. **Daily Management**: Manage today's appointments and patient flow
4. **Patient Updates**: Update patient contact and basic information

### Doctor Workflow
1. **Patient Review**: View assigned patients and their histories
2. **Appointment Management**: Review and manage upcoming appointments
3. **Medical Records**: Update patient medical records and notes
4. **Schedule Planning**: View personal schedule and availability

### Common Tasks

#### Adding a New Patient
1. Navigate to Patients page
2. Click "Add Patient" button
3. Fill in patient information form
4. Assign to appropriate doctor
5. Save patient record

#### Scheduling an Appointment
1. Navigate to Appointments page
2. Click "Add Appointment" button
3. Select patient and doctor
4. Choose date and time
5. Add reason and notes
6. Confirm appointment

#### Managing Users (Admin Only)
1. Navigate to Users page
2. View existing users and their roles
3. Create new users with appropriate roles
4. Edit or deactivate users as needed

## 📁 Project Structure

### Backend Structure
```
ClinicSystem.API/
├── Controllers/                 # API Controllers
│   ├── AuthController.cs       # Authentication endpoints
│   ├── UsersController.cs      # User management
│   ├── PatientsController.cs   # Patient operations
│   ├── AppointmentsController.cs # Appointment management
│   ├── DoctorsController.cs    # Doctor operations
│   └── ...                     # Other medical record controllers
├── Models/                     # Entity Models
│   ├── User.cs                 # User entity
│   ├── Patient.cs              # Patient entity
│   ├── Appointment.cs          # Appointment entity
│   ├── Doctor.cs               # Doctor entity
│   └── ...                     # Other medical entities
├── DTOs/                       # Data Transfer Objects
│   ├── LoginDto.cs             # Login request/response
│   ├── UserDto.cs              # User data transfer
│   ├── PatientDto.cs           # Patient data transfer
│   └── ...                     # Other DTOs
├── Data/                       # Database Context
│   └── ClinicDbContext.cs      # EF Core DbContext
├── Migrations/                 # EF Core Migrations
├── Profiles/                   # AutoMapper Profiles
│   └── AutoMapper.cs           # Mapping configurations
├── Properties/
│   └── launchSettings.json     # Launch configurations
├── Program.cs                  # Application entry point
├── appsettings.json           # Configuration settings
└── ClinicSystem.API.csproj    # Project file
```

### Frontend Structure
```
clinic-frontend/
├── public/                     # Static Assets
│   ├── index.html             # HTML template
│   └── vite.svg               # Vite logo
├── src/
│   ├── components/            # Reusable Components
│   │   ├── PrivateRoute.jsx   # Route protection
│   │   ├── Select.jsx         # Custom select component (react-select wrapper)
│   │   ├── Spinner.jsx        # Loading spinner
│   │   └── TruncatedCell.jsx  # Text truncation with modal
│   ├── pages/                 # Page Components
│   │   ├── HomePage.jsx       # Dashboard with calendar and stats
│   │   ├── LoginPage.jsx      # Authentication page
│   │   ├── RegisterPage.jsx   # User registration
│   │   ├── UserManagementPage.jsx # User management (Admin)
│   │   ├── UsersPage.jsx      # Legacy users page
│   │   ├── PatientsPage.jsx   # Patient management with modals
│   │   ├── PatientDetailsPage.jsx # Detailed patient view with medical records
│   │   ├── AppointmentsPage.jsx # Appointment management with filtering
│   │   ├── DoctorsPage.jsx    # Doctor management (Admin/Receptionist)
│   │   ├── DoctorDashboardPage.jsx # Doctor's personal dashboard
│   │   ├── ConfirmationModal.jsx # Reusable confirmation dialog
│   │   └── TruncatedCell.js   # Legacy truncated cell export
│   ├── utils/                 # Utility Functions
│   │   └── auth.js            # Authentication utilities
│   ├── App.jsx                # Main application component
│   ├── App.css                # Global styles
│   ├── main.jsx               # Application entry point
│   ├── index.css              # Base styles
│   └── config.js              # Configuration settings
├── package.json               # Node.js dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── eslint.config.js          # ESLint configuration
```

## ⚙️ Configuration

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;port=5432;Database=gyn&obs_clinic;Username=postgres;password=yourpassword"
  },
  "Jwt": {
    "Key": "your-secret-jwt-key-here",
    "Issuer": "ClinicSystem",
    "Audience": "ClinicSystemUsers"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Frontend Configuration (config.js)
```javascript
const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'https://localhost:5001/api'
  : 'https://your-production-api.com';

export default API_BASE_URL;
```

### HTML Title Configuration (index.html)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Women's Clinic System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Environment Variables
```bash
# Backend (.env or appsettings.json)
DATABASE_URL=postgresql://username:password@localhost:5432/clinic_db
JWT_SECRET=your-super-secret-jwt-key
ASPNETCORE_ENVIRONMENT=Development

# Frontend (.env)
VITE_API_BASE_URL=https://localhost:7158/api
VITE_APP_TITLE=ClinicSystem
```

## 🛠 Development

### Backend Development
```bash
# Watch mode for automatic restart
dotnet watch run

# Run tests
dotnet test

# Add new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Generate controllers
dotnet aspnet-codegenerator controller -name ControllerName -api
```

### Frontend Development
```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Install new package
npm install package-name
```

### Database Operations
```bash
# Create migration
dotnet ef migrations add AddNewFeature

# Remove last migration
dotnet ef migrations remove

# Update to specific migration
dotnet ef database update MigrationName

# Generate SQL script
dotnet ef migrations script
```

### Code Quality Tools
```bash
# Format code
dotnet format

# Run security scan
dotnet list package --vulnerable

# Frontend linting
npm run lint

# Fix lint issues
npm run lint:fix
```

## 🚀 Deployment

### Backend Deployment
```bash
# Publish application
dotnet publish -c Release -o ./publish

# Docker deployment (create Dockerfile)
FROM mcr.microsoft.com/dotnet/aspnet:9.0
COPY publish/ /app/
WORKDIR /app
EXPOSE 80
ENTRYPOINT ["dotnet", "ClinicSystem.API.dll"]
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files (example with serve)
npx serve -s dist

# Or deploy to hosting service
# Upload dist/ folder to your hosting provider
```

### Database Deployment
```bash
# Generate production migration script
dotnet ef migrations script --output migration.sql

# Apply to production database
psql -h your-db-host -U username -d database_name -f migration.sql
```

### Environment-Specific Configurations
```json
// appsettings.Production.json
{
  "ConnectionStrings": {
    "DefaultConnection": "production-database-connection-string"
  },
  "Jwt": {
    "Key": "production-jwt-secret"
  }
}
```

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test
dotnet test --filter "TestMethodName"
```

### Frontend Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d "gyn&obs_clinic"

# Reset password
sudo -u postgres psql
\password postgres
```

#### CORS Issues
```csharp
// In Program.cs, ensure CORS is configured
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

#### JWT Token Issues
```javascript
// Check token expiration
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token expires:', new Date(payload.exp * 1000));
```

## 📊 Performance Optimization

### Backend Optimization
- Use async/await for database operations
- Implement caching for frequently accessed data
- Use pagination for large datasets
- Optimize database queries with proper indexing

### Frontend Optimization
- Implement code splitting with React.lazy
- Use React.memo for component optimization
- Implement virtual scrolling for large lists
- Optimize bundle size with tree shaking

## 🔒 Security Considerations

### Authentication Security
- JWT tokens with appropriate expiration
- Password hashing with BCrypt
- HTTPS enforcement in production
- CORS configuration

### Data Protection
- Input validation and sanitization
- SQL injection prevention with EF Core
- XSS protection with proper output encoding
- Role-based access control

## 📈 Monitoring & Logging

### Backend Logging
```csharp
// Configure logging in Program.cs
builder.Logging.AddConsole();
builder.Logging.AddFile("logs/app-{Date}.txt");
```

### Frontend Error Tracking
```javascript
// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to logging service
});
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Standards
- Follow C# coding conventions for backend
- Use ESLint configuration for frontend
- Write unit tests for new features
- Update documentation for API changes

### Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update README if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check existing documentation
- Review troubleshooting guide

## 🙏 Acknowledgments

- Built with love for healthcare professionals
- Thanks to the open-source community
- Special thanks to contributors and testers

---

**Made with ❤️ for better healthcare management**