import { Link } from 'react-router';
import { Calendar, Users, Shield, Clock, Star, Award } from 'lucide-react';
import { getUserFromStorage } from '../utils/auth';

export default function Home() {
  const user = getUserFromStorage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                نظام إدارة المواعيد الطبية
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                احجز موعدك مع أفضل الأطباء في جميع التخصصات الطبية بكل سهولة وأمان
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {user ? (
                  <Link
                    to="/specialties"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
                  >
                    احجز موعدك الآن
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
                    >
                      إنشاء حساب جديد
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold"
                    >
                      تسجيل الدخول
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop"
                  alt="Medical Team"
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              لماذا تختار نظامنا؟
            </h2>
            <p className="text-xl text-gray-600">
              نوفر لك تجربة حجز مواعيد طبية متكاملة وسهلة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">حجز سهل وسريع</h3>
              <p className="text-gray-600 leading-relaxed">
                احجز موعدك مع الطبيب المناسب في دقائق معدودة من خلال واجهة بسيطة وسهلة الاستخدام
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">أطباء متخصصون</h3>
              <p className="text-gray-600 leading-relaxed">
                اختر من بين مجموعة واسعة من الأطباء المتخصصين في جميع المجالات الطبية
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">آمن وموثوق</h3>
              <p className="text-gray-600 leading-relaxed">
                نحافظ على خصوصية بياناتك الطبية بأعلى معايير الأمان والحماية
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">متاح 24/7</h3>
              <p className="text-gray-600 leading-relaxed">
                احجز موعدك في أي وقت ومن أي مكان عبر النظام المتاح على مدار الساعة
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">تقييمات موثوقة</h3>
              <p className="text-gray-600 leading-relaxed">
                اطلع على تقييمات المرضى الآخرين لاختيار الطبيب الأنسب لك
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">وصفات إلكترونية</h3>
              <p className="text-gray-600 leading-relaxed">
                احصل على وصفتك الطبية إلكترونياً مع رمز QR للصيدلية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">12+</div>
              <div className="text-xl opacity-90">طبيب متخصص</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">6</div>
              <div className="text-xl opacity-90">تخصصات طبية</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">15,000+</div>
              <div className="text-xl opacity-90">مريض راضٍ</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.8</div>
              <div className="text-xl opacity-90">متوسط التقييم</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ابدأ رحلتك نحو صحة أفضل اليوم
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            انضم إلى آلاف المرضى الذين يثقون بنا لإدارة مواعيدهم الطبية
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-semibold text-lg"
            >
              إنشاء حساب مجاني
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
