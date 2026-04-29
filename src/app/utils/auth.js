// نظام المصادقة وإدارة الجلسة

export const getUserFromStorage = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setUserToStorage = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const removeUserFromStorage = () => {
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = () => {
  return getUserFromStorage() !== null;
};

export const getUserRole = () => {
  const user = getUserFromStorage();
  return user ? user.role : null;
};

export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    setUserToStorage(userWithoutPassword);
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
};

export const register = (userData) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find(u => u.email === userData.email)) {
    return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
  }
  
  const newUser = {
    id: Date.now(),
    ...userData,
    role: userData.role || 'patient',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const { password, ...userWithoutPassword } = newUser;
  setUserToStorage(userWithoutPassword);
  
  return { success: true, user: userWithoutPassword };
};

export const logout = () => {
  removeUserFromStorage();
};

// Initialize admin and doctor accounts
export const initializeDefaultAccounts = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: 1,
        email: 'admin@clinic.com',
        password: 'admin123',
        name: 'مدير النظام',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        email: 'doctor@clinic.com',
        password: 'doctor123',
        name: 'د. أحمد محمود',
        role: 'doctor',
        doctorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        email: 'pharmacist@clinic.com',
        password: 'pharma123',
        name: 'صيدلي النظام',
        role: 'pharmacist',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        email: 'patient1@demo.com',
        password: 'patient123',
        name: 'أحمد محمد',
        role: 'patient',
        phone: '01234567890',
        dateOfBirth: '1985-05-15',
        bloodType: 'A+',
        allergies: ['البنسلين'],
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        email: 'patient2@demo.com',
        password: 'patient123',
        name: 'فاطمة علي',
        role: 'patient',
        phone: '01234567891',
        dateOfBirth: '1990-08-22',
        bloodType: 'O-',
        allergies: [],
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    
    // Initialize demo data for medical platform
    const { initializeMedicalRecords } = require('./medicalRecords');
    const { initializePrescriptions } = require('./prescriptions');
    const { initializeHealthIndicators } = require('./healthTracking');
    const { initializeVoiceMessages } = require('./voiceMessages');
    
    initializeMedicalRecords();
    initializePrescriptions();
    initializeHealthIndicators();
    initializeVoiceMessages();
  }
};
