import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import { getMedicalRecordsByPatient, getMedicalRecordById } from '../utils/medicalRecords';
import { getPrescriptionsByPatient } from '../utils/prescriptions';
import { getHealthIndicatorsByPatient, getHealthIndicatorConfig } from '../utils/healthTracking';
import { getVoiceMessagesByPatient } from '../utils/voiceMessages';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import {
  FileText, Calendar, User, Stethoscope, Pill, Activity, Mic,
  ChevronDown, ChevronUp, AlertCircle, TrendingUp, Heart,
  Droplets, Scale, Thermometer, Wind, Calculator
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const iconMap = {
  Activity, Heart, Droplets, Scale, Thermometer, Wind, Calculator
};

export default function PatientMedicalRecord() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [voiceMessages, setVoiceMessages] = useState([]);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState('bloodPressure');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Vérifier les permissions
    const targetPatientId = patientId ? parseInt(patientId) : currentUser.id;
    const isOwnRecord = targetPatientId === currentUser.id;
    
    if (!isOwnRecord && !hasPermission(currentUser.role, PERMISSIONS.VIEW_PATIENT_RECORDS)) {
      navigate('/');
      return;
    }

    setUser(currentUser);

    // Charger les données
    const patientRecords = getMedicalRecordsByPatient(targetPatientId);
    setRecords(patientRecords);

    const patientPrescriptions = getPrescriptionsByPatient(targetPatientId);
    setPrescriptions(patientPrescriptions);

    const patientIndicators = getHealthIndicatorsByPatient(targetPatientId);
    setIndicators(patientIndicators);

    const messages = getVoiceMessagesByPatient(targetPatientId);
    setVoiceMessages(messages);

    setLoading(false);
  }, [navigate, patientId]);

  const getChartData = () => {
    const typeIndicators = indicators.filter(i => i.type === selectedIndicator);
    return typeIndicators.map(i => ({
      date: new Date(i.date).toLocaleDateString('ar-EG'),
      value: i.value,
      notes: i.notes || ''
    }));
  };

  const getLatestIndicators = () => {
    const configs = getHealthIndicatorConfig;
    const types = ['bloodPressure', 'heartRate', 'bloodSugar', 'weight', 'temperature', 'oxygenSaturation'];
    return types.map(type => {
      const config = getHealthIndicatorConfig(type);
      const typeIndicators = indicators.filter(i => i.type === type);
      const latest = typeIndicators.length > 0 ? typeIndicators[typeIndicators.length - 1] : null;
      return { type, config, latest };
    }).filter(item => item.latest);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (!user) return null;

  const targetPatientId = patientId ? parseInt(patientId) : user.id;
  const isDoctor = user.role === 'doctor';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">السجل الطبي</h1>
          <p className="text-xl text-gray-600">
            {isDoctor ? `سجل المريض رقم ${targetPatientId}` : 'سجلك الطبي الشخصي'}
          </p>
        </div>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">السجلات</span>
            </TabsTrigger>
            <TabsTrigger value="indicators" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">المؤشرات</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">الوصفات</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">الرسائل الصوتية</span>
            </TabsTrigger>
          </TabsList>

          {/* Medical Records Tab */}
          <TabsContent value="records">
            <div className="space-y-4">
              {records.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد سجلات طبية</h3>
                    <p className="text-gray-600">لم يتم تسجيل أي زيارات طبية بعد</p>
                  </CardContent>
                </Card>
              ) : (
                records.map((record) => (
                  <Card key={record.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Stethoscope className="w-5 h-5 text-blue-600" />
                              <h3 className="text-lg font-bold text-gray-900">{record.diagnosis}</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(record.date).toLocaleDateString('ar-EG')}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {record.doctorName}
                              </div>
                            </div>
                          </div>
                          {expandedRecord === record.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {expandedRecord === record.id && (
                        <div className="px-6 pb-6 border-t bg-gray-50">
                          <div className="pt-4 space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">الأعراض:</h4>
                              <p className="text-gray-700 bg-white p-3 rounded-lg">{record.symptoms}</p>
                            </div>
                            
                            {record.notes && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">الملاحظات الطبية:</h4>
                                <p className="text-gray-700 bg-white p-3 rounded-lg">{record.notes}</p>
                              </div>
                            )}

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">العلاج:</h4>
                              <p className="text-gray-700 bg-white p-3 rounded-lg">{record.treatment}</p>
                            </div>

                            {record.prescriptions && record.prescriptions.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">الأدوية الموصوفة:</h4>
                                <div className="space-y-2">
                                  {record.prescriptions.map((med) => (
                                    <div key={med.id} className="bg-white p-3 rounded-lg border">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Pill className="w-4 h-4 text-blue-600" />
                                        <span className="font-semibold">{med.name}</span>
                                      </div>
                                      <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                                        <span>الجرعة: {med.dosage}</span>
                                        <span>المدة: {med.duration}</span>
                                        <span>التكرار: {med.frequency}</span>
                                        {med.instructions && <span className="col-span-2">تعليمات: {med.instructions}</span>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Health Indicators Tab */}
          <TabsContent value="indicators">
            <div className="space-y-6">
              {/* Latest Indicators Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getLatestIndicators().map(({ type, config, latest }) => {
                  const IconComponent = iconMap[config.icon] || Activity;
                  const isNormal = latest.value >= config.normalRange.min && latest.value <= config.normalRange.max;
                  return (
                    <Card key={type}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">{config.nameAr}</p>
                            <p className="text-2xl font-bold" style={{ color: config.color }}>
                              {latest.value} <span className="text-sm">{config.unit}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(latest.date).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                          <div className={`p-3 rounded-full ${isNormal ? 'bg-green-100' : 'bg-red-100'}`}>
                            <IconComponent className={`w-6 h-6 ${isNormal ? 'text-green-600' : 'text-red-600'}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    تطور المؤشرات الصحية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <select
                      value={selectedIndicator}
                      onChange={(e) => setSelectedIndicator(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bloodPressure">ضغط الدم</option>
                      <option value="heartRate">نبضات القلب</option>
                      <option value="bloodSugar">سكر الدم</option>
                      <option value="weight">الوزن</option>
                      <option value="temperature">درجة الحرارة</option>
                      <option value="oxygenSaturation">نسبة الأكسجين</option>
                    </select>
                  </div>

                  {getChartData().length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={getHealthIndicatorConfig(selectedIndicator)?.nameAr}
                          stroke={getHealthIndicatorConfig(selectedIndicator)?.color}
                          strokeWidth={2}
                          dot={{ fill: getHealthIndicatorConfig(selectedIndicator)?.color }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">لا توجد بيانات كافية لعرض الرسم البياني</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions">
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد وصفات طبية</h3>
                    <p className="text-gray-600">لم يتم إصدار أي وصفات طبية بعد</p>
                  </CardContent>
                </Card>
              ) : (
                prescriptions.map((prescription) => (
                  <Card key={prescription.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Pill className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900">وصفة طبية #{prescription.qrCode}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{prescription.doctorName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(prescription.createdAt).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            prescription.isDispensed
                              ? 'bg-blue-100 text-blue-800'
                              : prescription.isValid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {prescription.isDispensed ? 'تم الصرف' : prescription.isValid ? 'صالحة' : 'غير صالحة'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {prescription.medications.map((med, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-semibold text-gray-900">{med.name}</p>
                            <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-1">
                              <span>الجرعة: {med.dosage}</span>
                              <span>المدة: {med.duration}</span>
                              <span>التكرار: {med.frequency}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {prescription.notes && (
                        <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{prescription.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/prescription/${prescription.id}`)}
                        >
                          عرض التفاصيل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Voice Messages Tab */}
          <TabsContent value="voice">
            <div className="space-y-4">
              {voiceMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد رسائل صوتية</h3>
                    <p className="text-gray-600">لم يتم تسجيل أي رسائل صوتية بعد</p>
                  </CardContent>
                </Card>
              ) : (
                voiceMessages.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Mic className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900">رسالة صوتية</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              message.status === 'processed'
                                ? 'bg-green-100 text-green-800'
                                : message.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {message.status === 'processed' ? 'تمت المعالجة' : message.status === 'pending' ? 'قيد المعالجة' : 'خطأ'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            {new Date(message.createdAt).toLocaleDateString('ar-EG')} - {message.duration} ثانية
                          </p>
                          
                          {message.transcription && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-semibold text-gray-700 mb-1">النص المكتوب:</p>
                              <p className="text-gray-800 leading-relaxed">{message.transcription}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

