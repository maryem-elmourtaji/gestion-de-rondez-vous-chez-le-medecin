import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import { getAppointments } from '../utils/appointments';
import { doctors, specialties } from '../data/medicalData';
import { Users, Calendar, Stethoscope, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    totalDoctors: doctors.length,
    totalSpecialties: specialties.length
  });

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    setUser(currentUser);

    const allAppointments = getAppointments();
    setAppointments(allAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    setStats({
      totalAppointments: allAppointments.length,
      pendingAppointments: allAppointments.filter(a => a.status === 'pending').length,
      confirmedAppointments: allAppointments.filter(a => a.status === 'confirmed').length,
      completedAppointments: allAppointments.filter(a => a.status === 'completed').length,
      totalDoctors: doctors.length,
      totalSpecialties: specialties.length
    });
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'confirmed':
        return 'مؤكد';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-xl text-gray-600">مرحباً {user.name}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي المواعيد</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
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
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
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
                  <p className="text-sm text-gray-600 mb-1">المواعيد المؤكدة</p>
                  <p className="text-3xl font-bold text-green-600">{stats.confirmedAppointments}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">المواعيد المكتملة</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.completedAppointments}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">عدد الأطباء</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalDoctors}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">التخصصات الطبية</p>
                  <p className="text-3xl font-bold text-cyan-600">{stats.totalSpecialties}</p>
                </div>
                <div className="bg-cyan-100 p-3 rounded-full">
                  <Stethoscope className="w-8 h-8 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              المواعيد الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد مواعيد مسجلة</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">المريض</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الطبيب</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">التخصص</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">التاريخ</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الوقت</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">السعر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 10).map((appointment) => (
                      <tr key={appointment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                            <p className="text-sm text-gray-500">{appointment.patientEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{appointment.doctorName}</td>
                        <td className="py-3 px-4 text-gray-600">{appointment.specialty}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(appointment.date).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{appointment.time}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {appointment.consultationFee} جنيه
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
