import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import { getPrescriptionById, isPrescriptionExpired } from '../utils/prescriptions';
import { getMedicalRecordById } from '../utils/medicalRecords';
import {
  QrCode, Pill, Calendar, User, Stethoscope, CheckCircle, XCircle,
  AlertCircle, ArrowRight, Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function PrescriptionDetail() {
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const [user, setUser] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    const pres = getPrescriptionById(prescriptionId);
    if (pres) {
      setPrescription(pres);
      if (pres.recordId) {
        const rec = getMedicalRecordById(pres.recordId);
        setRecord(rec);
      }
    }
    setLoading(false);
  }, [navigate, prescriptionId]);

  const getStatusBadge = () => {
    if (!prescription) return null;
    if (prescription.isDispensed) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
          <CheckCircle className="w-4 h-4" />
          تم الصرف
        </span>
      );
    }
    if (isPrescriptionExpired(prescription)) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
          <XCircle className="w-4 h-4" />
          منتهية الصلاحية
        </span>
      );
    }
    if (prescription.isValid) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4" />
          صالحة
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
        <XCircle className="w-4 h-4" />
        غير صالحة
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">الوصفة غير موجودة</h2>
          <p className="text-gray-600 mb-6">لم يتم العثور على الوصفة المطلوبة</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={user?.role === 'pharmacist' ? '/pharmacist-scanner' : '/medical-record'}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <ArrowRight className="w-5 h-5" />
          العودة
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-6 h-6 text-blue-600" />
                تفاصيل الوصفة الطبية
              </CardTitle>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Section */}
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-white p-2 rounded-lg shadow">
                {/* Simulated QR Code */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-white" />
                </div>
              </div>
              <p className="text-lg font-mono font-bold text-gray-800">{prescription.qrCode}</p>
              <p className="text-sm text-gray-500">امسح الرمز للتحقق من صحة الوصفة</p>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">المريض</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{prescription.patientName}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">الطبيب</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{prescription.doctorName}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">تاريخ الوصفة</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(prescription.createdAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">تاريخ الانتهاء</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(prescription.expiresAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>

            {/* Medications */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                الأدوية الموصوفة
              </h3>
              <div className="space-y-3">
                {prescription.medications.map((med, idx) => (
                  <div key={idx} className="bg-white border-2 border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{med.name}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">الجرعة:</span>
                        <span className="mr-1 font-medium text-gray-800">{med.dosage}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">التكرار:</span>
                        <span className="mr-1 font-medium text-gray-800">{med.frequency}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">المدة:</span>
                        <span className="mr-1 font-medium text-gray-800">{med.duration}</span>
                      </div>
                      {med.instructions && (
                        <div className="col-span-2">
                          <span className="text-gray-500">التعليمات:</span>
                          <span className="mr-1 font-medium text-gray-800">{med.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {prescription.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-1">ملاحظات الطبيب:</h4>
                <p className="text-yellow-800">{prescription.notes}</p>
              </div>
            )}

            {prescription.isDispensed && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">معلومات الصرف:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>تم الصرف بواسطة: {prescription.dispensedBy}</p>
                  <p>تاريخ الصرف: {new Date(prescription.dispensedAt).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 ml-2" />
            طباعة
          </Button>
          {user?.role === 'patient' && !prescription.isDispensed && (
            <Link to="/pharmacist-scanner" className="flex-1">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <QrCode className="w-4 h-4 ml-2" />
                عرض QR للصيدلي
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

