import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { doctors } from '../data/medicalData';
import { getUserFromStorage } from '../utils/auth';
import { saveAppointment } from '../utils/appointments';
import { Star, Clock, Users, Award, Languages, GraduationCap, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function DoctorDetail() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    symptoms: '',
    notes: ''
  });

  useEffect(() => {
    const foundDoctor = doctors.find(d => d.id === parseInt(doctorId));
    setDoctor(foundDoctor);
  }, [doctorId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }

    const appointment = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      patientId: user.id,
      patientName: user.name,
      patientEmail: user.email,
      patientPhone: user.phone,
      date: formData.date,
      time: formData.time,
      symptoms: formData.symptoms,
      notes: formData.notes,
      consultationFee: doctor.consultationFee
    };

    saveAppointment(appointment);
    toast.success('تم حجز الموعد بنجاح!');
    navigate('/my-appointments');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[date.getDay()];
  };

  const isDateAvailable = (dateString) => {
    if (!dateString || !doctor) return false;
    const dayName = getDayName(dateString);
    return doctor.availableDays.includes(dayName);
  };

  if (!doctor) {
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
          to={`/specialty/${doctor.specialtyId}/doctors`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <ArrowRight className="w-5 h-5" />
          العودة إلى قائمة الأطباء
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">{doctor.rating}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
                <p className="text-lg text-blue-600 mb-4">{doctor.specialty}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">المؤهلات</p>
                      <p className="text-sm text-gray-600">{doctor.education}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">الخبرة</p>
                      <p className="text-sm text-gray-600">{doctor.experience} سنة</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">عدد المرضى</p>
                      <p className="text-sm text-gray-600">{doctor.patients} مريض</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Languages className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">اللغات</p>
                      <p className="text-sm text-gray-600">{doctor.languages.join(' - ')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">أيام العمل</p>
                      <p className="text-sm text-gray-600">{doctor.availableDays.join(' - ')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">سعر الكشف</p>
                  <p className="text-3xl font-bold text-blue-600">{doctor.consultationFee} جنيه</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  احجز موعدك
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">التاريخ</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="ltr"
                      />
                      {formData.date && !isDateAvailable(formData.date) && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>الطبيب غير متاح في يوم {getDayName(formData.date)}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">الوقت</label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        disabled={!formData.date || !isDateAvailable(formData.date)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">اختر الوقت</option>
                        {doctor.availableTimes.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">الأعراض</label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="صف الأعراض التي تعاني منها..."
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أي ملاحظات أو تفاصيل إضافية..."
                    ></textarea>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">سعر الكشف</span>
                      <span className="text-xl font-bold text-gray-900">{doctor.consultationFee} جنيه</span>
                    </div>
                    <p className="text-sm text-gray-500">* السعر شامل الكشف والفحص الطبي</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={!formData.date || !isDateAvailable(formData.date)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    تأكيد الحجز
                  </Button>

                  {!user && (
                    <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-900">يجب تسجيل الدخول</p>
                        <p className="text-sm text-yellow-700">
                          يجب عليك{' '}
                          <Link to="/login" className="font-semibold underline">
                            تسجيل الدخول
                          </Link>
                          {' '}أو{' '}
                          <Link to="/register" className="font-semibold underline">
                            إنشاء حساب
                          </Link>
                          {' '}لحجز موعد
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
