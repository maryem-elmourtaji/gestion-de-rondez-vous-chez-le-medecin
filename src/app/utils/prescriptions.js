// Gestion des prescriptions avec codes QR

export const getPrescriptions = () => {
  return JSON.parse(localStorage.getItem('prescriptions') || '[]');
};

export const getPrescriptionsByPatient = (patientId) => {
  const prescriptions = getPrescriptions();
  return prescriptions.filter(p => p.patientId === patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getPrescriptionsByDoctor = (doctorId) => {
  const prescriptions = getPrescriptions();
  return prescriptions.filter(p => p.doctorId === doctorId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getPrescriptionById = (id) => {
  const prescriptions = getPrescriptions();
  return prescriptions.find(p => p.id === parseInt(id));
};

export const getPrescriptionByQrCode = (qrCode) => {
  const prescriptions = getPrescriptions();
  return prescriptions.find(p => p.qrCode === qrCode);
};

export const generateQrCode = () => {
  return 'RX-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
};

export const savePrescription = (prescription) => {
  const prescriptions = getPrescriptions();
  const newPrescription = {
    id: Date.now(),
    ...prescription,
    qrCode: prescription.qrCode || generateQrCode(),
    isValid: true,
    isDispensed: false,
    createdAt: new Date().toISOString(),
    expiresAt: prescription.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
  prescriptions.push(newPrescription);
  localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
  return newPrescription;
};

export const dispensePrescription = (prescriptionId, pharmacistName) => {
  const prescriptions = getPrescriptions();
  const index = prescriptions.findIndex(p => p.id === parseInt(prescriptionId));
  if (index !== -1) {
    prescriptions[index] = {
      ...prescriptions[index],
      isDispensed: true,
      dispensedAt: new Date().toISOString(),
      dispensedBy: pharmacistName
    };
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
    return prescriptions[index];
  }
  return null;
};

export const invalidatePrescription = (prescriptionId) => {
  const prescriptions = getPrescriptions();
  const index = prescriptions.findIndex(p => p.id === parseInt(prescriptionId));
  if (index !== -1) {
    prescriptions[index] = {
      ...prescriptions[index],
      isValid: false
    };
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
    return prescriptions[index];
  }
  return null;
};

export const deletePrescription = (prescriptionId) => {
  const prescriptions = getPrescriptions();
  const filtered = prescriptions.filter(p => p.id !== parseInt(prescriptionId));
  localStorage.setItem('prescriptions', JSON.stringify(filtered));
};

export const isPrescriptionValid = (prescription) => {
  if (!prescription.isValid) return false;
  if (prescription.isDispensed) return false;
  const now = new Date();
  const expiry = new Date(prescription.expiresAt);
  return now.getTime() >= expiry.getTime(); // corrected logic
};

export const isPrescriptionExpired = (prescription) => {
  const now = new Date();
  const expiry = new Date(prescription.expiresAt);
  return now > expiry;
};

// Initialiser des prescriptions de démonstration
export const initializePrescriptions = () => {
  const prescriptions = getPrescriptions();
  if (prescriptions.length === 0) {
    const demoPrescriptions = [
      {
        id: 1,
        recordId: 1,
        patientId: 4,
        patientName: 'أحمد محمد',
        doctorId: 1,
        doctorName: 'د. أحمد محمود',
        appointmentId: 1,
        qrCode: 'RX-A1B2C3D4-1705312800000',
        medications: [
          { id: 1, medicationId: 7, name: 'أملوديبين 5mg', dosage: '5mg', duration: '30 يوم', frequency: 'مرة واحدة يومياً', instructions: 'تناول الدواء في نفس الوقت كل يوم' }
        ],
        notes: 'متابعة ضغط الدم بعد شهر',
        isValid: true,
        isDispensed: true,
        dispensedAt: '2024-01-15T12:00:00Z',
        dispensedBy: 'صيدلي النظام',
        createdAt: '2024-01-15T10:00:00Z',
        expiresAt: '2024-02-15T10:00:00Z'
      },
      {
        id: 2,
        recordId: 3,
        patientId: 5,
        patientName: 'فاطمة علي',
        doctorId: 3,
        doctorName: 'د. محمد عبدالله',
        appointmentId: 3,
        qrCode: 'RX-E5F6G7H8-1709259600000',
        medications: [
          { id: 3, medicationId: 5, name: 'لوراتادين 10mg', dosage: '10mg', duration: '14 يوم', frequency: 'مرة واحدة يومياً', instructions: 'تناول قبل النوم' },
          { id: 4, medicationId: 11, name: 'كريم مرطب', dosage: 'طبقة رقيقة', duration: '30 يوم', frequency: 'مرتين يومياً', instructions: 'دهن على المناطق المصابة' }
        ],
        notes: 'تجنب التعرض للمواد المهيجة',
        isValid: true,
        isDispensed: false,
        createdAt: '2024-03-01T10:00:00Z',
        expiresAt: '2024-04-01T10:00:00Z'
      }
    ];
    localStorage.setItem('prescriptions', JSON.stringify(demoPrescriptions));
  }
};

