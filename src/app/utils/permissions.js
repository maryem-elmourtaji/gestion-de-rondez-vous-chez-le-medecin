// Système de gestion stricte des rôles et permissions

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  PHARMACIST: 'pharmacist'
};

export const PERMISSIONS = {
  // Patient permissions
  VIEW_OWN_RECORDS: 'view_own_records',
  BOOK_APPOINTMENT: 'book_appointment',
  CANCEL_OWN_APPOINTMENT: 'cancel_own_appointment',
  VIEW_OWN_PRESCRIPTIONS: 'view_own_prescriptions',
  ADD_HEALTH_INDICATOR: 'add_health_indicator',
  RECORD_VOICE_MESSAGE: 'record_voice_message',

  // Doctor permissions
  VIEW_PATIENT_RECORDS: 'view_patient_records',
  ADD_DIAGNOSIS: 'add_diagnosis',
  ADD_PRESCRIPTION: 'add_prescription',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  VIEW_HEALTH_INDICATORS: 'view_health_indicators',
  ADD_MEDICAL_NOTES: 'add_medical_notes',

  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_DOCTORS: 'manage_doctors',
  VIEW_STATISTICS: 'view_statistics',
  MANAGE_SPECIALTIES: 'manage_specialties',
  VIEW_ALL_RECORDS: 'view_all_records',

  // Pharmacist permissions
  SCAN_PRESCRIPTION: 'scan_prescription',
  DISPENSE_MEDICATION: 'dispense_medication',
  VIEW_PRESCRIPTION_DETAILS: 'view_prescription_details'
};

const ROLE_PERMISSIONS = {
  [ROLES.PATIENT]: [
    PERMISSIONS.VIEW_OWN_RECORDS,
    PERMISSIONS.BOOK_APPOINTMENT,
    PERMISSIONS.CANCEL_OWN_APPOINTMENT,
    PERMISSIONS.VIEW_OWN_PRESCRIPTIONS,
    PERMISSIONS.ADD_HEALTH_INDICATOR,
    PERMISSIONS.RECORD_VOICE_MESSAGE
  ],
  [ROLES.DOCTOR]: [
    PERMISSIONS.VIEW_PATIENT_RECORDS,
    PERMISSIONS.ADD_DIAGNOSIS,
    PERMISSIONS.ADD_PRESCRIPTION,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_HEALTH_INDICATORS,
    PERMISSIONS.ADD_MEDICAL_NOTES
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_DOCTORS,
    PERMISSIONS.VIEW_STATISTICS,
    PERMISSIONS.MANAGE_SPECIALTIES,
    PERMISSIONS.VIEW_ALL_RECORDS,
    PERMISSIONS.MANAGE_APPOINTMENTS
  ],
  [ROLES.PHARMACIST]: [
    PERMISSIONS.SCAN_PRESCRIPTION,
    PERMISSIONS.DISPENSE_MEDICATION,
    PERMISSIONS.VIEW_PRESCRIPTION_DETAILS
  ]
};

export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

export const hasAnyPermission = (role, permissions) => {
  return permissions.some(permission => hasPermission(role, permission));
};

export const hasAllPermissions = (role, permissions) => {
  return permissions.every(permission => hasPermission(role, permission));
};

export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

export const canAccessRoute = (role, route) => {
  const routePermissions = {
    '/admin-dashboard': [PERMISSIONS.VIEW_STATISTICS],
    '/doctor-dashboard': [PERMISSIONS.MANAGE_APPOINTMENTS],
    '/pharmacist-scanner': [PERMISSIONS.SCAN_PRESCRIPTION],
    '/my-appointments': [PERMISSIONS.BOOK_APPOINTMENT],
    '/medical-record': [PERMISSIONS.VIEW_OWN_RECORDS, PERMISSIONS.VIEW_PATIENT_RECORDS],
    '/health-tracking': [PERMISSIONS.ADD_HEALTH_INDICATOR, PERMISSIONS.VIEW_HEALTH_INDICATORS],
    '/voice-message': [PERMISSIONS.RECORD_VOICE_MESSAGE],
    '/prescriptions': [PERMISSIONS.VIEW_OWN_PRESCRIPTIONS, PERMISSIONS.VIEW_PRESCRIPTION_DETAILS]
  };

  const required = routePermissions[route];
  if (!required) return true;
  return hasAnyPermission(role, required);
};

