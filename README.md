# Sistema de Gestión de Citas Médicas

Una plataforma integral de gestión de citas médicas diseñada para optimizar la interacción entre pacientes, doctores y administradores.

## 🎯 Objetivo
El objetivo de esta aplicación es digitalizar y optimizar la programación y gestión de citas médicas, proporcionando un entorno seguro y eficiente para que los proveedores de salud gestionen su disponibilidad y los pacientes administren su historial médico y reservas.

## 🛠️ Tecnologías
- **Frontend**: React, TypeScript, Vite
- **Backend y Base de Datos**: Supabase (PostgreSQL y Auth)
- **Estilos**: Tailwind CSS
- **Gestión de Estado**: React Context API (`AuthContext`, `AppointmentContext`)

## 🏛️ Arquitectura
El proyecto sigue una arquitectura modular basada en componentes:

### 📂 Estructura del Proyecto
- `src/pages/`: Dividido por roles de usuario para una clara separación de responsabilidades:
  - `/Administrator`: Dashboard y gestión de doctores.
  - `/Doctor`: Gestión de disponibilidad, edición de perfil y centro de citas.
  - `/Patient`: Programación de citas, historial médico y soporte.
- `src/context/`: Gestión de estado global para Autenticación y Citas.
- `src/layout/`: Envoltorios especializados (`AdminLayout`, `DoctorLayout`, `PatientLayout`) para mantener una UI consistente según el rol.
- `src/components/`: Elementos de interfaz reutilizables y componentes de formulario especializados para cargas de archivos e información personal.
- `src/lib/`: Archivos de configuración para servicios externos (ej. cliente de Supabase).
- `src/types/`: Definiciones centralizadas de TypeScript para garantizar la seguridad de tipos.

## 👥 Roles de Usuario y Funcionalidades
### 🏥 Paciente
- Programar y gestionar citas médicas.
- Acceder y mantener el historial médico.
- Configuración de perfil y cuenta.

### 👨‍⚕️ Doctor
- Gestionar la disponibilidad profesional y horarios.
- Centro de Citas para seguimiento de visitas de pacientes.
- Gestión de perfil profesional y credenciales.
- Centro de notificaciones para alertas de citas.

### ⚙️ Administrador
- Panel de control centralizado para el monitoreo del sistema.
- Gestión del personal médico (Lista y Administrador de Doctores).
