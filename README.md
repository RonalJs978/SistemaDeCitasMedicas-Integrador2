# Appointment System

A comprehensive medical appointment management platform designed to streamline the interaction between patients, doctors, and administrators.

## 🎯 Objective
The goal of this application is to digitize and optimize the scheduling and management of medical appointments, providing a secure and efficient environment for healthcare providers to manage their availability and for patients to manage their medical history and bookings.

## 🛠️ Technologies
- **Frontend**: React, TypeScript, Vite
- **Backend & Database**: Supabase (PostgreSQL & Auth)
- **Styling**: Tailwind CSS (implied by project structure)
- **State Management**: React Context API (`AuthContext`, `AppointmentContext`)

## 🏛️ Architecture
The project follows a modular component-based architecture:

### 📂 Project Structure
- `src/pages/`: Divided by user roles for clear separation of concerns:
  - `/Administrator`: Dashboard and Doctor management.
  - `/Doctor`: Availability, profile editing, and appointment center.
  - `/Patient`: Scheduling, medical history, and support.
- `src/context/`: Global state management for Authentication and Appointments.
- `src/layout/`: Specialized wrappers (`AdminLayout`, `DoctorLayout`, `PatientLayout`) to maintain consistent UI per role.
- `src/components/`: Reusable UI elements and specialized form components for uploads and personal info.
- `src/lib/`: Configuration files for external services (e.g., Supabase client).
- `src/types/`: Centralized TypeScript definitions for type safety.

## 👥 User Roles & Functionalities
### 🏥 Patient
- Schedule and manage medical appointments.
- Access and maintain medical history.
- Profile and account configuration.

### 👨‍⚕️ Doctor
- Manage professional availability and schedules.
- Access an Appointments Center to track patient visits.
- Manage professional profile and credentials.
- Notification center for appointment alerts.

### ⚙️ Administrator
- Centralized Dashboard for system monitoring.
- Management of the medical staff (Doctor List and Manager).
