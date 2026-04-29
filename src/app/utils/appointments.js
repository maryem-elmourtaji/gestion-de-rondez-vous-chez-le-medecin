// إدارة المواعيد

export const getAppointments = () => {
  return JSON.parse(localStorage.getItem('appointments') || '[]');
};

export const saveAppointment = (appointment) => {
  const appointments = getAppointments();
  const newAppointment = {
    id: Date.now(),
    ...appointment,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  return newAppointment;
};

export const updateAppointmentStatus = (appointmentId, status) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === appointmentId);
  if (index !== -1) {
    appointments[index].status = status;
    appointments[index].updatedAt = new Date().toISOString();
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return appointments[index];
  }
  return null;
};

export const deleteAppointment = (appointmentId) => {
  const appointments = getAppointments();
  const filtered = appointments.filter(a => a.id !== appointmentId);
  localStorage.setItem('appointments', JSON.stringify(filtered));
};

export const getAppointmentsByDoctor = (doctorId) => {
  const appointments = getAppointments();
  return appointments.filter(a => a.doctorId === doctorId);
};

export const getAppointmentsByPatient = (patientId) => {
  const appointments = getAppointments();
  return appointments.filter(a => a.patientId === patientId);
};

export const getPrescriptions = () => {
  return JSON.parse(localStorage.getItem('prescriptions') || '[]');
};

export const savePrescription = (prescription) => {
  const prescriptions = getPrescriptions();
  const newPrescription = {
    id: Date.now(),
    ...prescription,
    createdAt: new Date().toISOString()
  };
  prescriptions.push(newPrescription);
  localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
  return newPrescription;
};

export const getPrescriptionById = (id) => {
  const prescriptions = getPrescriptions();
  return prescriptions.find(p => p.id === parseInt(id));
};
