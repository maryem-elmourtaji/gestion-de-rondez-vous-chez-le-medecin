import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import { getPrescriptionByQrCode, dispensePrescription, getPrescriptions } from '../utils/prescriptions';
import { QrCode, CheckCircle, XCircle, AlertCircle, Pill, Scan, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function PharmacistScanner() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [prescriptionCode, setPrescriptionCode] = useState('');
  const [scannedPrescription, setScannedPrescription] = useState(null);
  const [error, setError] = useState('');
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser || currentUser.role !== 'pharmacist') {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Load recent prescriptions
    const all = getPrescriptions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setRecentPrescriptions(all.slice(0, 5));
  }, [navigate]);

  const handleScan = () => {
    setError('');
    setScannedPrescription(null);

    if (!prescriptionCode.trim()) {
      setError('الرجاء إدخال كود الوصفة الطبية');
      return;
    }

    const prescription = getPrescriptionByQrCode(prescriptionCode.trim());

    if (!prescription) {
      setError('لم يتم العثور على وصفة بهذا الكود');
      return;
    }

    setScannedPrescription(prescription);
  };

  const handleDispense = () => {
    if (!scannedPrescription || !user) return;

    if (scannedPrescription.isDispensed) {
      toast.error('هذه الوصفة تم صرفها مسبقاً');
      return;
    }

    if (!scannedPrescription.isValid) {
      toast.error('هذه الوصفة غير صالحة');
      return;
    }

    const result = dispensePrescription(scannedPrescription.id, user.name);
    if (result) {
      toast.success('تم صرف الوصفة بنجاح!');
      setScannedPrescription(result);
      // Refresh recent list
      const all = getPrescriptions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentPrescriptions(all.slice(0, 5));
    }
  };

  const handleRecentClick = (code) => {
    setPrescriptionCode(code);
    const prescription = getPrescriptionByQrCode(code);
    if (prescription) {
      setScannedPrescription(prescription);
      setError('');
    }
  };

  if (!user || user.role !== 'pharmacist') {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ماسح الوصفات الطبية</h1>
          <p className="text-xl text-gray-600">مرحباً {user.name}</p>
        </div>

        {/* Scanner Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-6 h-6" />
              مسح الوصفة الطبية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <QrCode className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  أدخل كود الوصفة الطبية للتحقق من صحتها وعرض تفاصيل الأدوية
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">كود الوصفة الطبية</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prescriptionCode}
                    onChange={(e) => setPrescriptionCode(e.target.value)}
                    placeholder="مثال: RX-A1B2C3D4-..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  />
                  <Button
                    onClick={handleScan}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        {!scannedPrescription && recentPrescriptions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">الوصفات الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentPrescriptions.map((pres) => (
                  <button
                    key={pres.id}
                    onClick={() => handleRecentClick(pres.qrCode)}
                    className="w-full text-right p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{pres.patientName}</p>
                      <p className="text-sm text-gray-500">{pres.doctorName}</p>
                    </div>
                    <div className="text-left">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        pres.isDispensed ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {pres.isDispensed ? 'تم الصرف' : 'صالحة'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{pres.qrCode}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanned Prescription Details */}
        {scannedPrescription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {scannedPrescription.isValid && !scannedPrescription.isDispensed ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-600">وصفة طبية صالحة</span>
                  </>
                ) : scannedPrescription.isDispensed ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-600">وصفة تم صرفها</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="text-red-600">وصفة طبية غير صالحة</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">اسم المريض</p>
                    <p className="text-lg font-semibold text-gray-900">{scannedPrescription.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">اسم الطبيب</p>
                    <p className="text-lg font-semibold text-gray-900">{scannedPrescription.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الوصفة</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(scannedPrescription.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم الوصفة</p>
                    <p className="text-lg font-semibold text-gray-900 font-mono">{scannedPrescription.qrCode}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Pill className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">الأدوية الموصوفة</h3>
                  </div>
                  <div className="space-y-4">
                    {scannedPrescription.medications.map((med, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-gray-900 mb-2">{med.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <p><span className="font-medium">الجرعة:</span> {med.dosage}</p>
                          <p><span className="font-medium">المدة:</span> {med.duration}</p>
                          <p><span className="font-medium">التكرار:</span> {med.frequency}</p>
                          {med.instructions && (
                            <p className="col-span-2"><span className="font-medium">التعليمات:</span> {med.instructions}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {scannedPrescription.notes && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-1">ملاحظات الطبيب:</p>
                    <p className="text-sm text-gray-700">{scannedPrescription.notes}</p>
                  </div>
                )}

                {scannedPrescription.isDispensed && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">معلومات الصرف:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>تم الصرف بواسطة: {scannedPrescription.dispensedBy}</p>
                      <p>تاريخ الصرف: {new Date(scannedPrescription.dispensedAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {scannedPrescription.isValid && !scannedPrescription.isDispensed && (
                    <Button
                      onClick={handleDispense}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      تأكيد صرف الأدوية
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setPrescriptionCode('');
                      setScannedPrescription(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    مسح البحث
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">تعليمات الاستخدام:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• تأكد من صحة بيانات المريض قبل صرف الأدوية</li>
                <li>• تحقق من تاريخ صلاحية الوصفة الطبية</li>
                <li>• اشرح للمريض كيفية استخدام الأدوية بشكل صحيح</li>
                <li>• احتفظ بنسخة من الوصفة في السجلات</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

