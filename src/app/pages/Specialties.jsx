import { useState } from 'react';
import { Link } from 'react-router';
import { specialties } from '../data/medicalData';
import { Search } from 'lucide-react';

export default function Specialties() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">اختر التخصص الطبي</h1>
          <p className="text-xl text-gray-600">ابحث عن الطبيب المناسب في التخصص الذي تحتاجه</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن تخصص طبي..."
              className="w-full pr-12 pl-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Specialties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecialties.map((specialty) => (
            <Link
              key={specialty.id}
              to={`/specialty/${specialty.id}/doctors`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8 h-full">
                <div className={`bg-gradient-to-r ${specialty.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <span className="text-4xl">{specialty.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{specialty.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{specialty.nameEn}</p>
                <p className="text-gray-600 leading-relaxed">{specialty.description}</p>
                <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  <span>عرض الأطباء</span>
                  <span className="group-hover:translate-x-1 transition-transform">←</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredSpecialties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">لا توجد نتائج للبحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
