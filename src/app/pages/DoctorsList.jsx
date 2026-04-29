import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { doctors, specialties } from '../data/medicalData';
import { Star, Clock, Users, Award, ArrowRight } from 'lucide-react';

export default function DoctorsList() {
  const { specialtyId } = useParams();
  const [specialty, setSpecialty] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);

  useEffect(() => {
    const spec = specialties.find(s => s.id === parseInt(specialtyId));
    setSpecialty(spec);
    
    const filteredDoctors = doctors.filter(d => d.specialtyId === parseInt(specialtyId));
    setDoctorsList(filteredDoctors);
  }, [specialtyId]);

  if (!specialty) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/specialties"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <ArrowRight className="w-5 h-5" />
          العودة إلى التخصصات
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className={`bg-gradient-to-r ${specialty.color} w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <span className="text-5xl">{specialty.icon}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{specialty.name}</h1>
          <p className="text-xl text-gray-600">{specialty.description}</p>
          <p className="text-lg text-gray-500 mt-2">{doctorsList.length} طبيب متاح</p>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctorsList.map((doctor) => (
            <Link
              key={doctor.id}
              to={`/doctor/${doctor.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden h-full">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">{doctor.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                  <p className="text-gray-600 mb-4">{doctor.specialty}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{doctor.experience} سنة خبرة</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{doctor.patients} مريض</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">متاح {doctor.availableDays.length} أيام</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">سعر الكشف</p>
                      <p className="text-xl font-bold text-blue-600">{doctor.consultationFee} جنيه</p>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                      احجز الآن
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {doctorsList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">لا يوجد أطباء متاحون في هذا التخصص حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
