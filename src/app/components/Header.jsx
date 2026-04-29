import { Link, useNavigate, useLocation } from 'react-router';
import { getUserFromStorage, logout } from '../utils/auth';
import {
  Stethoscope, User, LogOut, Menu, X, Home, FileText,
  Activity, Mic, QrCode, Shield, Calendar
} from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromStorage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'doctor') return '/doctor-dashboard';
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'pharmacist') return '/pharmacist-scanner';
    return '/specialties';
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'doctor': return 'طبيب';
      case 'admin': return 'مدير';
      case 'pharmacist': return 'صيدلي';
      case 'patient': return 'مريض';
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-800">عيادتي</span>
              <p className="text-xs text-gray-500">المنصة الطبية الذكية</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Link>

            {user && (
              <>
                {/* Patient links */}
                {user.role === 'patient' && (
                  <>
                    <Link
                      to="/specialties"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isActive('/specialties') || isActive('/specialty')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4" />
                      التخصصات
                    </Link>
                    <Link
                      to="/my-appointments"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isActive('/my-appointments')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      مواعيدي
                    </Link>
                    <Link
                      to="/medical-record"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isActive('/medical-record')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      السجل الطبي
                    </Link>
                    <Link
                      to="/health-tracking"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isActive('/health-tracking')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      المؤشرات
                    </Link>
                    <Link
                      to="/voice-message"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isActive('/voice-message')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      رسالة صوتية
                    </Link>
                  </>
                )}

                {/* Doctor links */}
                {user.role === 'doctor' && (
                  <>
                    <Link
                      to="/doctor-dashboard"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isActive('/doctor-dashboard')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4" />
                      لوحة التحكم
                    </Link>
                  </>
                )}

                {/* Admin links */}
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin-dashboard"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isActive('/admin-dashboard')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      الإدارة
                    </Link>
                  </>
                )}

                {/* Pharmacist links */}
                {user.role === 'pharmacist' && (
                  <>
                    <Link
                      to="/pharmacist-scanner"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isActive('/pharmacist-scanner')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      مسح الوصفات
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-2 mr-2 border-r pr-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    خروج
                  </button>
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                الرئيسية
              </Link>

              {user && (
                <>
                  {user.role === 'patient' && (
                    <>
                      <Link to="/specialties" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <Stethoscope className="w-4 h-4" /> التخصصات
                      </Link>
                      <Link to="/my-appointments" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <Calendar className="w-4 h-4" /> مواعيدي
                      </Link>
                      <Link to="/medical-record" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <FileText className="w-4 h-4" /> السجل الطبي
                      </Link>
                      <Link to="/health-tracking" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <Activity className="w-4 h-4" /> المؤشرات
                      </Link>
                      <Link to="/voice-message" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <Mic className="w-4 h-4" /> رسالة صوتية
                      </Link>
                    </>
                  )}
                  {user.role === 'doctor' && (
                    <Link to="/doctor-dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                      <Stethoscope className="w-4 h-4" /> لوحة التحكم
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                      <Shield className="w-4 h-4" /> الإدارة
                    </Link>
                  )}
                  {user.role === 'pharmacist' && (
                    <Link to="/pharmacist-scanner" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                      <QrCode className="w-4 h-4" /> مسح الوصفات
                    </Link>
                  )}

                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                    تسجيل الدخول
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-blue-600 text-white rounded-lg text-center">
                    إنشاء حساب
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

