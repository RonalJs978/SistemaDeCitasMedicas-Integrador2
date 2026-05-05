type appointment_status = 'pending' | 'confirmed' | 'cancelled';

export interface User {
  dni: number;
  name: string;
  email: string;
  password: string;
}

export interface Appointment {
    id:number;
    userDni: number;
    date: string;
    time: string;
    status: appointment_status;
}

