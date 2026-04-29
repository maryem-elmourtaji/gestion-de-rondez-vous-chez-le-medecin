import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import { getAppointmentsByPatient, deleteAppointment } from '../utils/appointments';
import { Calendar, Clock, User, FileText, Trash2, AlertCircle, Pill, Mic, FileSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function MyAppointments() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userAppointments = getAppointmentsByPatient(user.id);
    setAppointments(userAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, [user, navigate]);

  const handleDelete = (appointmentId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      deleteAppointment(appointmentId);
      setAppointments(appointments.filter(a => a.id !== appointmentId));
      toast.success('تم حذف الموعد بنجاح');
    }
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

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">مواعيدي</h1>
          <p className="text-xl text-gray-600">جميع مواعيدك الطبية في مكان واحد</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to="/specialties">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-4 h-4 ml-2" />
              حجز موعد جديد
            </Button>
          </Link>
          <Link to="/voice-message">
            <Button variant="outline">
              <Mic className="w-4 h-4 ml-2" />
              رسالة صوتية
            </Button>
          </Link>
          <Link to="/medical-record">
            <Button variant="outline">
              <FileSearch className="w-4 h-4 ml-2" />
              السجل الطبي
            </Button>
          </Link>
          <Link to="/health-tracking">
            <Button variant="outline">
              <FileText className="w-4 h-4 ml-2" />
              المؤشرات الصحية
            </Button>
          </Link>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مواعيد</h3>
              <p className="text-gray-600 mb-6">لم تقم بحجز أي موعد بعد</p>
              <Link to="/specialties">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  احجز موعدك الأول
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-blue-600">{appointment.specialty}</p>
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
                        <div className="flex items-start gap-2 text-gray-600">
                          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold">الأعراض:</p>
                            <p className="text-sm">{appointment.symptoms}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2">
                        <div className="text-sm text-gray-500">
                          تم الحجز: {new Date(appointment.createdAt).toLocaleDateString('ar-EG')}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          السعر: {appointment.consultationFee} جنيه
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      {appointment.status === 'completed' && (
                        <Link to={`/medical-record`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <FileSearch className="w-4 h-4" />
                            عرض التقرير
                          </Button>
                        </Link>
                      )}
                      {appointment.status === 'pending' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(appointment.id)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          إلغاء الموعد
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">ملاحظات هامة:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• يرجى الحضور قبل موعدك بـ 15 دقيقة</li>
                <li>• في حالة عدم القدرة على الحضور، يرجى إلغاء الموعد قبل 24 ساعة على الأقل</li>
                <li>• أحضر معك بطاقة الهوية والتقارير الطبية السابقة إن وجدت</li>
                <li>• يمكنك إرسال رسالة صوتية لوصف أعراضك قبل الموعد</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

