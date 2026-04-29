// Types pour la plateforme médicale intelligente

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin' | 'pharmacist';
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Doctor extends User {
  role: 'doctor';
  doctorId: number;
  specialtyId: number;
  specialty: string;
  experience: number;
  rating: number;
  patients: number;
  education: string;
  languages: string[];
  availableDays: string[];
  availableTimes: string[];
  consultationFee: number;
  image: string;
  bio?: string;
}

export interface Specialty {
  id: number;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  color: string;
}

export interface Appointment {
  id: number;
  doctorId: number;
  doctorName: string;
  specialty: string;
  patientId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  symptoms: string;
  notes?: string;
  consultationFee: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentId: number;
  date: string;
  diagnosis: string;
  symptoms: string;
  notes: string;
  treatment: string;
  prescriptions: PrescriptionItem[];
  attachments?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PrescriptionItem {
  id: number;
  medicationId: number;
  name: string;
  dosage: string;
  duration: string;
  frequency: string;
  instructions?: string;
}

export interface Prescription {
  id: number;
  recordId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentId: number;
  qrCode: string;
  medications: PrescriptionItem[];
  notes?: string;
  isValid: boolean;
  isDispensed: boolean;
  dispensedAt?: string;
  dispensedBy?: string;
  createdAt: string;
  expiresAt: string;
}

export interface HealthIndicator {
  id: number;
  patientId: number;
  type: 'bloodPressure' | 'heartRate' | 'bloodSugar' | 'weight' | 'temperature' | 'oxygenSaturation' | 'bmi';
  value: number;
  unit: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface HealthIndicatorConfig {
  type: HealthIndicator['type'];
  name: string;
  nameAr: string;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  icon: string;
  color: string;
}

export interface VoiceMessage {
  id: number;
  patientId: number;
  patientName: string;
  appointmentId?: number;
  audioUrl: string;
  transcription: string;
  language: string;
  duration: number;
  status: 'pending' | 'processed' | 'error';
  createdAt: string;
}

export interface Medication {
  id: number;
  name: string;
  category: string;
  description?: string;
  sideEffects?: string[];
}

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalDoctors: number;
  totalPatients: number;
  totalSpecialties: number;
  totalPrescriptions: number;
  totalRevenue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  dateOfBirth?: string;
  bloodType?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

