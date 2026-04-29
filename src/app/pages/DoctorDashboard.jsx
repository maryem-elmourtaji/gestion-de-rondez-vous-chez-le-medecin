import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import { getAppointmentsByDoctor, updateAppointmentStatus } from '../utils/appointments';
import { getMedicalRecordsByDoctor } from '../utils/medicalRecords';
import { getPrescriptionsByDoctor } from '../utils/prescriptions';
import {
  Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle,
  Stethoscope, Pill, TrendingUp, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });

  const loadData = (currentUser) => {
    if (!currentUser || !currentUser.doctorId) return;

    const doctorAppointments = getAppointmentsByDoctor(currentUser.doctorId);
    const sortedAppointments = doctorAppointments.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA - dateB;
    });

    setAppointments(sortedAppointments);
    setRecords(getMedicalRecordsByDoctor(currentUser.doctorId));
    setPrescriptions(getPrescriptionsByDoctor(currentUser.doctorId));

    setStats({
      total: doctorAppointments.length,
      pending: doctorAppointments.filter(a => a.status === 'pending').length,
      confirmed: doctorAppointments.filter(a => a.status === 'confirmed').length,
      completed: doctorAppointments.filter(a => a.status === 'completed').length
    });
  };

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser || currentUser.role !== 'doctor') {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    loadData(currentUser);
  }, [navigate]);

  const handleUpdateStatus = (appointmentId, status) => {
    updateAppointmentStatus(appointmentId, status);
    if (user) {
      loadData(user);
    }

    const statusMessages = {
      confirmed: 'تم تأكيد الموعد',
      completed: 'تم إتمام الموعد',
      cancelled: 'تم إلغاء الموعد'
    };

    toast.success(statusMessages[status] || 'تم تحديث حالة الموعد');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (!user || user.role !== 'doctor') {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة تحكم الطبيب</h1>
          <p className="text-xl text-gray-600">مرحباً {user.name}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي المواعيد</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">قيد الانتظار</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">التشخيصات</p>
                  <p className="text-3xl font-bold text-purple-600">{records.length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Stethoscope className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الوصفات</p>
                  <p className="text-3xl font-bold text-green-600">{prescriptions.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Pill className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">المواعيد</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">التشخيصات</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">الوصفات</span>
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  مواعيد المرضى
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">لا توجد مواعيد مسجلة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="w-5 h-5 text-blue-600" />
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {appointment.patientName}
                                  </h3>
                                </div>
                                <p className="text-gray-600">{appointment.patientEmail}</p>
                                <p className="text-gray-600">{appointment.patientPhone}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                                {getStatusText(appointment.status)}
                              </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">
                                  {new Date(appointment.date).toLocaleDateString('ar-EG', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">{appointment.time}</span>
                              </div>
                            </div>

                            {appointment.symptoms && (
                              <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 mb-1">الأعراض:</p>
                                  <p className="text-sm text-gray-700">{appointment.symptoms}</p>
                                  {appointment.notes && (
                                    <>
                                      <p className="text-sm font-semibold text-gray-900 mb-1 mt-2">ملاحظات:</p>
                                      <p className="text-sm text-gray-700">{appointment.notes}</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex lg:flex-col gap-2">
                            <Link to={`/patient/${appointment.patientId}`}>
                              <Button variant="outline" className="flex items-center gap-2 w-full">
                                <Eye className="w-4 h-4" />
                                عرض الملف
                              </Button>
                            </Link>
                            {appointment.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  تأكيد
                                </Button>
                                <Button
                                  onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                                  variant="destructive"
                                  className="flex items-center gap-2"
                                >
                                  <XCircle className="w-4 h-4" />
                                  إلغاء
                                </Button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button
                                onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                إتمام
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records">
            <div className="space-y-4">
              {records.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">لا توجد تشخيصات مسجلة</p>
                  </CardContent>
                </Card>
              ) : (
                records.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{record.diagnosis}</h3>
                          <p className="text-sm text-gray-500">
                            {record.patientName} - {new Date(record.date).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                        <Link to={`/medical-record/${record.patientId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 ml-1" />
                            عرض
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions">
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Pill className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">لا توجد وصفات مسجلة</p>
                  </CardContent>
                </Card>
              ) : (
                prescriptions.map((pres) => (
                  <Card key={pres.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">وصفة #{pres.qrCode}</h3>
                          <p className="text-sm text-gray-500">
                            {pres.patientName} - {new Date(pres.createdAt).toLocaleDateString('ar-EG')}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {pres.medications.length} دواء
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          pres.isDispensed ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {pres.isDispensed ? 'تم الصرف' : 'صالحة'}
                        </span>
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

