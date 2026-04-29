// Gestion des dossiers médicaux

export const getMedicalRecords = () => {
  return JSON.parse(localStorage.getItem('medicalRecords') || '[]');
};

export const getMedicalRecordsByPatient = (patientId) => {
  const records = getMedicalRecords();
  return records.filter(r => r.patientId === patientId).sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getMedicalRecordsByDoctor = (doctorId) => {
  const records = getMedicalRecords();
  return records.filter(r => r.doctorId === doctorId).sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getMedicalRecordById = (id) => {
  const records = getMedicalRecords();
  return records.find(r => r.id === parseInt(id));
};

export const getMedicalRecordsByAppointment = (appointmentId) => {
  const records = getMedicalRecords();
  return records.filter(r => r.appointmentId === appointmentId);
};

export const saveMedicalRecord = (record) => {
  const records = getMedicalRecords();
  const newRecord = {
    id: Date.now(),
    ...record,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  records.push(newRecord);
  localStorage.setItem('medicalRecords', JSON.stringify(records));
  return newRecord;
};

export const updateMedicalRecord = (id, updates) => {
  const records = getMedicalRecords();
  const index = records.findIndex(r => r.id === parseInt(id));
  if (index !== -1) {
    records[index] = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('medicalRecords', JSON.stringify(records));
    return records[index];
  }
  return null;
};

export const deleteMedicalRecord = (id) => {
  const records = getMedicalRecords();
  const filtered = records.filter(r => r.id !== parseInt(id));
  localStorage.setItem('medicalRecords', JSON.stringify(filtered));
};

// Initialiser des dossiers médicaux de démonstration
export const initializeMedicalRecords = () => {
  const records = getMedicalRecords();
  if (records.length === 0) {
    const demoRecords = [
      {
        id: 1,
        patientId: 4,
        patientName: 'أحمد محمد',
        doctorId: 1,
        doctorName: 'د. أحمد محمود',
        appointmentId: 1,
        date: '2024-01-15',
        diagnosis: 'ارتفاع ضغط الدم',
        symptoms: 'صداع مستمر، دوخة، إرهاق',
        notes: 'يحتاج إلى متابعة دورية. ننصح بتغيير نمط الحياة والتقليل من الملح.',
        treatment: 'أملوديبين 5mg مرة يومياً',
        prescriptions: [
          { id: 1, medicationId: 7, name: 'أملوديبين 5mg', dosage: '5mg', duration: '30 يوم', frequency: 'مرة واحدة يومياً', instructions: 'تناول الدواء في نفس الوقت كل يوم' }
        ],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        patientId: 4,
        patientName: 'أحمد محمد',
        doctorId: 1,
        doctorName: 'د. أحمد محمود',
        appointmentId: 2,
        date: '2024-02-15',
        diagnosis: 'تحسن في ضغط الدم',
        symptoms: 'تحسن طفيف في الصداع',
        notes: 'ضغط الدم تحت السيطرة. استمر على نفس العلاج.',
        treatment: 'استمرار أملوديبين 5mg',
        prescriptions: [
          { id: 2, medicationId: 7, name: 'أملوديبين 5mg', dosage: '5mg', duration: '30 يوم', frequency: 'مرة واحدة يومياً', instructions: 'تناول الدواء في نفس الوقت كل يوم' }
        ],
        createdAt: '2024-02-15T10:00:00Z',
        updatedAt: '2024-02-15T10:00:00Z'
      },
      {
        id: 3,
        patientId: 5,
        patientName: 'فاطمة علي',
        doctorId: 3,
        doctorName: 'د. محمد عبدالله',
        appointmentId: 3,
        date: '2024-03-01',
        diagnosis: 'حساسية جلدية',
        symptoms: 'طفح جلدي، حكة في اليدين',
        notes: 'تجنب التعرض للمواد المهيجة. استخدام مرطب يومياً.',
        treatment: 'لوراتادين 10mg + كريم مرطب',
        prescriptions: [
          { id: 3, medicationId: 5, name: 'لوراتادين 10mg', dosage: '10mg', duration: '14 يوم', frequency: 'مرة واحدة يومياً', instructions: 'تناول قبل النوم' },
          { id: 4, medicationId: 11, name: 'كريم مرطب', dosage: 'طبقة رقيقة', duration: '30 يوم', frequency: 'مرتين يومياً', instructions: 'دهن على المناطق المصابة' }
        ],
        createdAt: '2024-03-01T10:00:00Z',
        updatedAt: '2024-03-01T10:00:00Z'
      }
    ];
    localStorage.setItem('medicalRecords', JSON.stringify(demoRecords));
  }
};

