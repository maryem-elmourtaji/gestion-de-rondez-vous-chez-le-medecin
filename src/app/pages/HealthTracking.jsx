import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import {
  getHealthIndicatorsByPatient,
  getHealthIndicatorConfig,
  saveHealthIndicator,
  isValueInNormalRange,
  HEALTH_INDICATOR_CONFIGS
} from '../utils/healthTracking';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import {
  Activity, Plus, TrendingUp, AlertCircle, CheckCircle,
  Heart, Droplets, Scale, Thermometer, Wind, Calculator
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const iconMap = {
  Activity, Heart, Droplets, Scale, Thermometer, Wind, Calculator
};

export default function HealthTracking() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState('bloodPressure');
  const [newIndicator, setNewIndicator] = useState({
    value: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!hasPermission(currentUser.role, PERMISSIONS.ADD_HEALTH_INDICATOR) &&
        !hasPermission(currentUser.role, PERMISSIONS.VIEW_HEALTH_INDICATORS)) {
      navigate('/');
      return;
    }

    setUser(currentUser);
    loadIndicators(currentUser.id);
    setLoading(false);
  }, [navigate]);

  const loadIndicators = (patientId) => {
    const patientIndicators = getHealthIndicatorsByPatient(patientId);
    setIndicators(patientIndicators);
  };

  const getChartData = (type) => {
    const typeIndicators = indicators.filter(i => i.type === type);
    return typeIndicators.map(i => ({
      date: new Date(i.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
      value: i.value,
      fullDate: i.date
    }));
  };

  const getLatestValue = (type) => {
    const typeIndicators = indicators.filter(i => i.type === type);
    return typeIndicators.length > 0 ? typeIndicators[typeIndicators.length - 1].value : null;
  };

  const handleAddIndicator = () => {
    if (!newIndicator.value || !newIndicator.date) {
      toast.error('الرجاء إدخال القيمة والتاريخ');
      return;
    }

    const config = getHealthIndicatorConfig(selectedType);
    const indicatorData = {
      patientId: user.id,
      type: selectedType,
      value: parseFloat(newIndicator.value),
      unit: config.unit,
      date: newIndicator.date,
      notes: newIndicator.notes
    };

    saveHealthIndicator(indicatorData);
    loadIndicators(user.id);
    setShowAddDialog(false);
    setNewIndicator({ value: '', date: new Date().toISOString().split('T')[0], notes: '' });
    toast.success('تم إضافة المؤشر الصحي بنجاح');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">المؤشرات الصحية</h1>
          <p className="text-xl text-gray-600">تتبع وتحليل مؤشراتك الصحية عبر الوقت</p>
        </div>

        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة مؤشر جديد
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {HEALTH_INDICATOR_CONFIGS.map((config) => {
            const latest = getLatestValue(config.type);
            const IconComponent = iconMap[config.icon] || Activity;
            const isNormal = latest ? isValueInNormalRange(config.type, latest) : true;

            return (
              <Card key={config.type}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{config.nameAr}</p>
                      {latest !== null ? (
                        <div>
                          <p className="text-2xl font-bold" style={{ color: config.color }}>
                            {latest} <span className="text-sm">{config.unit}</span>
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {isNormal ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600">ضمن المعدل الطبيعي</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 text-red-500" />
                                <span className="text-xs text-red-600">خارج المعدل الطبيعي</span>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-lg text-gray-400">لا توجد بيانات</p>
                      )}
                    </div>
                    <div className="p-3 rounded-full bg-gray-100">
                      <IconComponent className="w-6 h-6" style={{ color: config.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {HEALTH_INDICATOR_CONFIGS.filter(config => getChartData(config.type).length > 1).map((config) => {
            const data = getChartData(config.type);
            return (
              <Card key={config.type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5" style={{ color: config.color }} />
                    {config.nameAr}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={config.color}
                        strokeWidth={2}
                        dot={{ fill: config.color }}
                        name={config.nameAr}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-2 text-center">
                    <span className="text-sm text-gray-500">
                      المعدل الطبيعي: {config.normalRange.min} - {config.normalRange.max} {config.unit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Indicator Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة مؤشر صحي جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">نوع المؤشر</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bloodPressure">ضغط الدم</option>
                  <option value="heartRate">نبضات القلب</option>
                  <option value="bloodSugar">سكر الدم</option>
                  <option value="weight">الوزن</option>
                  <option value="temperature">درجة الحرارة</option>
                  <option value="oxygenSaturation">نسبة الأكسجين</option>
                  <option value="bmi">مؤشر كتلة الجسم</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  القيمة ({getHealthIndicatorConfig(selectedType)?.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newIndicator.value}
                  onChange={(e) => setNewIndicator({ ...newIndicator, value: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل القيمة"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">التاريخ</label>
                <input
                  type="date"
                  value={newIndicator.date}
                  onChange={(e) => setNewIndicator({ ...newIndicator, date: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">ملاحظات (اختياري)</label>
                <textarea
                  value={newIndicator.notes}
                  onChange={(e) => setNewIndicator({ ...newIndicator, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>
                  إلغاء
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleAddIndicator}>
                  حفظ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

