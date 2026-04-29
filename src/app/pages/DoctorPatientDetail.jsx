import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import { getMedicalRecordsByPatient, saveMedicalRecord } from '../utils/medicalRecords';
import { savePrescription, generateQrCode } from '../utils/prescriptions';
import { getHealthIndicatorsByPatient } from '../utils/healthTracking';
import { getAppointmentsByPatient } from '../utils/appointments';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import { medications } from '../data/medicalData';
import {
  FileText, Heart, Activity, Pill, Calendar, User, ArrowRight,
  Plus, Stethoscope, Save, X, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function DoctorPatientDetail() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState(false);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // New diagnosis form
  const [diagnosisForm, setDiagnosisForm] = useState({
    diagnosis: '',
    symptoms: '',
    notes: '',
    treatment: ''
  });

  // New prescription form
  const [prescriptionMeds, setPrescriptionMeds] = useState([
    { medicationId: '', name: '', dosage: '', duration: '', frequency: '', instructions: '' }
  ]);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser || !hasPermission(currentUser.role, PERMISSIONS.VIEW_PATIENT_RECORDS)) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    const pid = parseInt(patientId);
    setRecords(getMedicalRecordsByPatient(pid));
    setIndicators(getHealthIndicatorsByPatient(pid));
    setAppointments(getAppointmentsByPatient(pid));
    setLoading(false);
  }, [navigate, patientId]);

  const getChartData = () => {
    const bp = indicators.filter(i => i.type === 'bloodPressure');
    return bp.map(i => ({
      date: new Date(i.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
      value: i.value
    }));
  };

  const handleSaveDiagnosis = () => {
    if (!diagnosisForm.diagnosis || !diagnosisForm.symptoms) {
      toast.error('الرجاء إدخال التشخيص والأعراض');
      return;
    }

    const newRecord = {
      patientId: parseInt(patientId),
      patientName: records[0]?.patientName || `مريض #${patientId}`,
      doctorId: user.doctorId || user.id,
      doctorName: user.name,
      appointmentId: appointments[0]?.id || null,
      date: new Date().toISOString().split('T')[0],
      ...diagnosisForm,
      prescriptions: []
    };

    saveMedicalRecord(newRecord);
    setRecords(getMedicalRecordsByPatient(parseInt(patientId)));
    setShowDiagnosisDialog(false);
    setDiagnosisForm({ diagnosis: '', symptoms: '', notes: '', treatment: '' });
    toast.success('تم حفظ التشخيص بنجاح!');
  };

  const handleAddMedField = () => {
    setPrescriptionMeds([...prescriptionMeds, { medicationId: '', name: '', dosage: '', duration: '', frequency: '', instructions: '' }]);
  };

  const handleRemoveMedField = (idx) => {
    setPrescriptionMeds(prescriptionMeds.filter((_, i) => i !== idx));
  };

  const handleMedChange = (idx, field, value) => {
    const updated = [...prescriptionMeds];
    updated[idx][field] = value;
    if (field === 'medicationId') {
      const med = medications.find(m => m.id === parseInt(value));
      if (med) updated[idx].name = med.name;
    }
    setPrescriptionMeds(updated);
  };

  const handleSavePrescription = () => {
    const validMeds = prescriptionMeds.filter(m => m.name && m.dosage);
    if (validMeds.length === 0) {
      toast.error('الرجاء إضافة دواء واحد على الأقل');
      return;
    }

    const newPrescription = {
      recordId: records[0]?.id || null,
      patientId: parseInt(patientId),
      patientName: records[0]?.patientName || `مريض #${patientId}`,
      doctorId: user.doctorId || user.id,
      doctorName: user.name,
      appointmentId: appointments[0]?.id || null,
      medications: validMeds.map((m, i) => ({ id: i + 1, ...m, medicationId: parseInt(m.medicationId) || 0 })),
      notes: prescriptionNotes,
      qrCode: generateQrCode()
    };

    savePrescription(newPrescription);
    setShowPrescriptionDialog(false);
    setPrescriptionMeds([{ medicationId: '', name: '', dosage: '', duration: '', frequency: '', instructions: '' }]);
    setPrescriptionNotes('');
    toast.success('تم إصدار الوصفة بنجاح!');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/doctor-dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <ArrowRight className="w-5 h-5" />
          العودة للوحة التحكم
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ملف المريض</h1>
          <p className="text-xl text-gray-600">عرض وإدارة السجل الطبي الكامل</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={() => setShowDiagnosisDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Stethoscope className="w-4 h-4 ml-2" />
            إضافة تشخيص
          </Button>
          <Button
            onClick={() => setShowPrescriptionDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Pill className="w-4 h-4 ml-2" />
            كتابة وصفة
          </Button>
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
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">المواعيد</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">الملخص</span>
            </TabsTrigger>
          </TabsList>

          {/* Records Tab */}
          <TabsContent value="records">
            <div className="space-y-4">
              {records.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد سجلات طبية مسجلة</p>
                  </CardContent>
                </Card>
              ) : (
                records.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{record.diagnosis}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(record.date).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">الأعراض:</p>
                          <p className="text-sm text-gray-600">{record.symptoms}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">العلاج:</p>
                          <p className="text-sm text-gray-600">{record.treatment}</p>
                        </div>
                        {record.notes && (
                          <div className="md:col-span-2">
                            <p className="text-sm font-semibold text-gray-700">الملاحظات:</p>
                            <p className="text-sm text-gray-600">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Indicators Tab */}
          <TabsContent value="indicators">
            {getChartData().length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    تطور ضغط الدم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد مؤشرات صحية مسجلة</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد مواعيد مسجلة</p>
                  </CardContent>
                </Card>
              ) : (
                appointments.map((appt) => (
                  <Card key={appt.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{appt.doctorName || user.name}</p>
                        <p className="text-sm text-gray-600">{appt.specialty}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(appt.date).toLocaleDateString('ar-EG')} - {appt.time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        appt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appt.status === 'completed' ? 'مكتمل' :
                         appt.status === 'confirmed' ? 'مؤكد' :
                         appt.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                      </span>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{records.length}</p>
                  <p className="text-gray-600">زيارة طبية</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Pill className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {records.reduce((acc, r) => acc + (r.prescriptions?.length || 0), 0)}
                  </p>
                  <p className="text-gray-600">وصفة طبية</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{indicators.length}</p>
                  <p className="text-gray-600">مؤشر صحي</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Diagnosis Dialog */}
        <Dialog open={showDiagnosisDialog} onOpenChange={setShowDiagnosisDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة تشخيص جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">التشخيص</label>
                <input
                  value={diagnosisForm.diagnosis}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, diagnosis: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="التشخيص الطبي"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">الأعراض</label>
                <textarea
                  value={diagnosisForm.symptoms}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, symptoms: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="أعراض المريض"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">العلاج</label>
                <input
                  value={diagnosisForm.treatment}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, treatment: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="خطة العلاج"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">ملاحظات</label>
                <textarea
                  value={diagnosisForm.notes}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="ملاحظات إضافية"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDiagnosisDialog(false)}>
                  إلغاء
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSaveDiagnosis}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Prescription Dialog */}
        <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>كتابة وصفة طبية</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {prescriptionMeds.map((med, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">الدواء {idx + 1}</span>
                    {idx > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveMedField(idx)} className="text-red-600">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">اسم الدواء</label>
                    <select
                      value={med.medicationId}
                      onChange={(e) => handleMedChange(idx, 'medicationId', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">اختر الدواء</option>
                      {medications.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">الجرعة</label>
                      <input
                        value={med.dosage}
                        onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="مثال: 500mg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">المدة</label>
                      <input
                        value={med.duration}
                        onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="مثال: 7 أيام"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">التكرار</label>
                      <input
                        value={med.frequency}
                        onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="مثال: 3 مرات يومياً"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">التعليمات</label>
                      <input
                        value={med.instructions}
                        onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="بعد الأكل"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={handleAddMedField} className="w-full">
                <Plus className="w-4 h-4 ml-2" />
                إضافة دواء
              </Button>

              <div>
                <label className="text-sm font-medium text-gray-700">ملاحظات الوصفة</label>
                <textarea
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="ملاحظات للمريض أو الصيدلي"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowPrescriptionDialog(false)}>
                  إلغاء
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSavePrescription}>
                  <Save className="w-4 h-4 ml-2" />
                  إصدار الوصفة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

