import { createBrowserRouter, Navigate } from 'react-router';
import { Root } from './Root';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Specialties from './pages/Specialties';
import DoctorsList from './pages/DoctorsList';
import DoctorDetail from './pages/DoctorDetail';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PharmacistScanner from './pages/PharmacistScanner';
import PatientMedicalRecord from './pages/PatientMedicalRecord';
import HealthTracking from './pages/HealthTracking';
import VoiceMessageRecorder from './pages/VoiceMessageRecorder';
import PrescriptionDetail from './pages/PrescriptionDetail';
import DoctorPatientDetail from './pages/DoctorPatientDetail';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'specialties', Component: Specialties },
      { path: 'specialty/:specialtyId/doctors', Component: DoctorsList },
      { path: 'doctor/:doctorId', Component: DoctorDetail },
      {
        path: 'my-appointments',
        element: (
          <ProtectedRoute allowedRoles={['patient', 'admin']}>
            <MyAppointments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin-dashboard',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctor-dashboard',
        element: (
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'pharmacist-scanner',
        element: (
          <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
            <PharmacistScanner />
          </ProtectedRoute>
        ),
      },
      {
        path: 'medical-record',
        element: (
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <PatientMedicalRecord />
          </ProtectedRoute>
        ),
      },
      {
        path: 'medical-record/:patientId',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <PatientMedicalRecord />
          </ProtectedRoute>
        ),
      },
      {
        path: 'health-tracking',
        element: (
          <ProtectedRoute allowedRoles={['patient', 'doctor']}>
            <HealthTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: 'voice-message',
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <VoiceMessageRecorder />
          </ProtectedRoute>
        ),
      },
      {
        path: 'prescription/:prescriptionId',
        element: (
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'pharmacist', 'admin']}>
            <PrescriptionDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient/:patientId',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorPatientDetail />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

