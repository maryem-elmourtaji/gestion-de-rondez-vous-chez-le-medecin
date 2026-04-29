// Suivi de l'évolution de l'état de santé

export const HEALTH_INDICATOR_CONFIGS = [
  {
    type: 'bloodPressure',
    name: 'Tension artérielle',
    nameAr: 'ضغط الدم',
    unit: 'mmHg',
    normalRange: { min: 90, max: 120 },
    icon: 'Activity',
    color: '#ef4444'
  },
  {
    type: 'heartRate',
    name: 'Fréquence cardiaque',
    nameAr: 'نبضات القلب',
    unit: 'bpm',
    normalRange: { min: 60, max: 100 },
    icon: 'Heart',
    color: '#ec4899'
  },
  {
    type: 'bloodSugar',
    name: 'Glycémie',
    nameAr: 'سكر الدم',
    unit: 'mg/dL',
    normalRange: { min: 70, max: 100 },
    icon: 'Droplets',
    color: '#3b82f6'
  },
  {
    type: 'weight',
    name: 'Poids',
    nameAr: 'الوزن',
    unit: 'kg',
    normalRange: { min: 50, max: 100 },
    icon: 'Scale',
    color: '#22c55e'
  },
  {
    type: 'temperature',
    name: 'Température',
    nameAr: 'درجة الحرارة',
    unit: '°C',
    normalRange: { min: 36.1, max: 37.2 },
    icon: 'Thermometer',
    color: '#f97316'
  },
  {
    type: 'oxygenSaturation',
    name: 'Saturation en oxygène',
    nameAr: 'نسبة الأكسجين',
    unit: '%',
    normalRange: { min: 95, max: 100 },
    icon: 'Wind',
    color: '#06b6d4'
  },
  {
    type: 'bmi',
    name: 'IMC',
    nameAr: 'مؤشر كتلة الجسم',
    unit: 'kg/m²',
    normalRange: { min: 18.5, max: 24.9 },
    icon: 'Calculator',
    color: '#8b5cf6'
  }
];

export const getHealthIndicators = () => {
  return JSON.parse(localStorage.getItem('healthIndicators') || '[]');
};

export const getHealthIndicatorsByPatient = (patientId) => {
  const indicators = getHealthIndicators();
  return indicators.filter(i => i.patientId === patientId).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getHealthIndicatorsByType = (patientId, type) => {
  const indicators = getHealthIndicatorsByPatient(patientId);
  return indicators.filter(i => i.type === type);
};

export const getLatestHealthIndicator = (patientId, type) => {
  const indicators = getHealthIndicatorsByType(patientId, type);
  return indicators.length > 0 ? indicators[indicators.length - 1] : null;
};

export const saveHealthIndicator = (indicator) => {
  const indicators = getHealthIndicators();
  const newIndicator = {
    id: Date.now(),
    ...indicator,
    createdAt: new Date().toISOString()
  };
  indicators.push(newIndicator);
  localStorage.setItem('healthIndicators', JSON.stringify(indicators));
  return newIndicator;
};

export const deleteHealthIndicator = (id) => {
  const indicators = getHealthIndicators();
  const filtered = indicators.filter(i => i.id !== parseInt(id));
  localStorage.setItem('healthIndicators', JSON.stringify(filtered));
};

export const getHealthIndicatorConfig = (type) => {
  return HEALTH_INDICATOR_CONFIGS.find(c => c.type === type);
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Insuffisance pondérale', labelAr: 'نقص الوزن', color: '#3b82f6' };
  if (bmi < 25) return { label: 'Poids normal', labelAr: 'وزن طبيعي', color: '#22c55e' };
  if (bmi < 30) return { label: 'Surpoids', labelAr: 'وزن زائد', color: '#f97316' };
  return { label: 'Obésité', labelAr: 'سمنة', color: '#ef4444' };
};

export const isValueInNormalRange = (type, value) => {
  const config = getHealthIndicatorConfig(type);
  if (!config) return true;
  return value >= config.normalRange.min && value <= config.normalRange.max;
};

// Initialiser des indicateurs de santé de démonstration
export const initializeHealthIndicators = () => {
  const indicators = getHealthIndicators();
  if (indicators.length === 0) {
    const demoIndicators = [
      // Indicateurs pour le patient 4 (أحمد محمد)
      { id: 1, patientId: 4, type: 'bloodPressure', value: 140, unit: 'mmHg', date: '2024-01-01', notes: 'Élevé' },
      { id: 2, patientId: 4, type: 'bloodPressure', value: 135, unit: 'mmHg', date: '2024-01-15', notes: 'Légère amélioration' },
      { id: 3, patientId: 4, type: 'bloodPressure', value: 128, unit: 'mmHg', date: '2024-02-01', notes: 'Amélioration continue' },
      { id: 4, patientId: 4, type: 'bloodPressure', value: 125, unit: 'mmHg', date: '2024-02-15', notes: 'Sous contrôle' },
      { id: 5, patientId: 4, type: 'bloodPressure', value: 122, unit: 'mmHg', date: '2024-03-01', notes: 'Stable' },
      { id: 6, patientId: 4, type: 'heartRate', value: 85, unit: 'bpm', date: '2024-01-01' },
      { id: 7, patientId: 4, type: 'heartRate', value: 82, unit: 'bpm', date: '2024-02-01' },
      { id: 8, patientId: 4, type: 'heartRate', value: 78, unit: 'bpm', date: '2024-03-01' },
      { id: 9, patientId: 4, type: 'weight', value: 85, unit: 'kg', date: '2024-01-01' },
      { id: 10, patientId: 4, type: 'weight', value: 83, unit: 'kg', date: '2024-02-01' },
      { id: 11, patientId: 4, type: 'weight', value: 81, unit: 'kg', date: '2024-03-01' },
      { id: 12, patientId: 4, type: 'bloodSugar', value: 110, unit: 'mg/dL', date: '2024-01-01' },
      { id: 13, patientId: 4, type: 'bloodSugar', value: 105, unit: 'mg/dL', date: '2024-02-01' },
      { id: 14, patientId: 4, type: 'bloodSugar', value: 98, unit: 'mg/dL', date: '2024-03-01' },
      
      // Indicateurs pour le patient 5 (فاطمة علي)
      { id: 15, patientId: 5, type: 'weight', value: 65, unit: 'kg', date: '2024-02-15' },
      { id: 16, patientId: 5, type: 'weight', value: 66, unit: 'kg', date: '2024-03-01' },
      { id: 17, patientId: 5, type: 'temperature', value: 37.5, unit: '°C', date: '2024-03-01', notes: 'Légère fièvre' },
      { id: 18, patientId: 5, type: 'oxygenSaturation', value: 98, unit: '%', date: '2024-03-01' }
    ];
    localStorage.setItem('healthIndicators', JSON.stringify(demoIndicators));
  }
};

