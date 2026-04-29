// Données médicales - Spécialités et Médecins

export const specialties = [
  {
    id: 1,
    name: 'أمراض القلب',
    nameEn: 'Cardiology',
    icon: '❤️',
    description: 'تشخيص وعلاج أمراض القلب والأوعية الدموية',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 2,
    name: 'الجلدية',
    nameEn: 'Dermatology',
    icon: '🧴',
    description: 'العناية بصحة الجلد والشعر والأظافر',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 3,
    name: 'الأسنان',
    nameEn: 'Dentistry',
    icon: '🦷',
    description: 'العناية بصحة الفم والأسنان',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 4,
    name: 'طب الأطفال',
    nameEn: 'Pediatrics',
    icon: '👶',
    description: 'رعاية صحة الأطفال من الولادة حتى المراهقة',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 5,
    name: 'العظام',
    nameEn: 'Orthopedics',
    icon: '🦴',
    description: 'علاج إصابات وأمراض العظام والمفاصل',
    color: 'from-orange-500 to-amber-600'
  },
  {
    id: 6,
    name: 'العيون',
    nameEn: 'Ophthalmology',
    icon: '👁️',
    description: 'فحص وعلاج أمراض العين والبصر',
    color: 'from-teal-500 to-cyan-600'
  }
];

export const doctors = [
  {
    id: 1,
    name: 'د. أحمد محمود',
    specialtyId: 1,
    specialty: 'أمراض القلب',
    experience: 15,
    rating: 4.8,
    patients: 1250,
    education: 'دكتوراه في أمراض القلب - جامعة القاهرة',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['الأحد', 'الاثنين', 'الأربعاء', 'الخميس'],
    availableTimes: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    consultationFee: 300,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: 'د. فاطمة السيد',
    specialtyId: 1,
    specialty: 'أمراض القلب',
    experience: 12,
    rating: 4.9,
    patients: 980,
    education: 'دكتوراه في أمراض القلب - جامعة الإسكندرية',
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس', 'السبت'],
    availableTimes: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
    consultationFee: 350,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: 'د. محمد عبدالله',
    specialtyId: 2,
    specialty: 'الجلدية',
    experience: 10,
    rating: 4.7,
    patients: 1500,
    education: 'دكتوراه في الأمراض الجلدية - جامعة عين شمس',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
    availableTimes: ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00'],
    consultationFee: 250,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    name: 'د. سارة أحمد',
    specialtyId: 2,
    specialty: 'الجلدية',
    experience: 8,
    rating: 4.6,
    patients: 870,
    education: 'ماجستير في الأمراض الجلدية - جامعة القاهرة',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
    availableTimes: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    consultationFee: 200,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
  },
  {
    id: 5,
    name: 'د. خالد حسن',
    specialtyId: 3,
    specialty: 'الأسنان',
    experience: 13,
    rating: 4.9,
    patients: 2100,
    education: 'دكتوراه في طب الأسنان - جامعة الأزهر',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الأربعاء', 'الخميس'],
    availableTimes: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    consultationFee: 280,
    image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?w=400&h=400&fit=crop'
  },
  {
    id: 6,
    name: 'د. نورا إبراهيم',
    specialtyId: 3,
    specialty: 'الأسنان',
    experience: 9,
    rating: 4.7,
    patients: 1340,
    education: 'ماجستير في طب الأسنان - جامعة القاهرة',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس', 'السبت'],
    availableTimes: ['10:00', '11:00', '12:00', '14:00', '15:00'],
    consultationFee: 220,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop'
  },
  {
    id: 7,
    name: 'د. عمر يوسف',
    specialtyId: 4,
    specialty: 'طب الأطفال',
    experience: 16,
    rating: 5.0,
    patients: 2300,
    education: 'دكتوراه في طب الأطفال - جامعة القاهرة',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    availableTimes: ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
    consultationFee: 320,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop'
  },
  {
    id: 8,
    name: 'د. ليلى محمد',
    specialtyId: 4,
    specialty: 'طب الأطفال',
    experience: 11,
    rating: 4.8,
    patients: 1680,
    education: 'دكتوراه في طب الأطفال - جامعة عين شمس',
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس', 'السبت'],
    availableTimes: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    consultationFee: 280,
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop'
  },
  {
    id: 9,
    name: 'د. طارق علي',
    specialtyId: 5,
    specialty: 'العظام',
    experience: 14,
    rating: 4.7,
    patients: 1450,
    education: 'دكتوراه في جراحة العظام - جامعة الإسكندرية',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الأربعاء'],
    availableTimes: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    consultationFee: 350,
    image: 'https://images.unsplash.com/photo-1613731111285-fb4b94204bf2?w=400&h=400&fit=crop'
  },
  {
    id: 10,
    name: 'د. مريم خالد',
    specialtyId: 5,
    specialty: 'العظام',
    experience: 10,
    rating: 4.6,
    patients: 920,
    education: 'ماجستير في جراحة العظام - جامعة القاهرة',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
    availableTimes: ['10:00', '11:00', '12:00', '15:00', '16:00'],
    consultationFee: 300,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop'
  },
  {
    id: 11,
    name: 'د. ياسر حسين',
    specialtyId: 6,
    specialty: 'العيون',
    experience: 18,
    rating: 4.9,
    patients: 2500,
    education: 'دكتوراه في طب وجراحة العيون - جامعة القاهرة',
    languages: ['العربية', 'الإنجليزية', 'الألمانية'],
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
    availableTimes: ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
    consultationFee: 400,
    image: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&h=400&fit=crop'
  },
  {
    id: 12,
    name: 'د. هدى سامي',
    specialtyId: 6,
    specialty: 'العيون',
    experience: 9,
    rating: 4.7,
    patients: 1120,
    education: 'ماجستير في طب وجراحة العيون - جامعة عين شمس',
    languages: ['العربية', 'الإنجليزية'],
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس', 'السبت'],
    availableTimes: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    consultationFee: 280,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
  }
];

export const medications = [
  { id: 1, name: 'أموكسيسيلين', category: 'مضاد حيوي' },
  { id: 2, name: 'باراسيتامول', category: 'مسكن وخافض حرارة' },
  { id: 3, name: 'إيبوبروفين', category: 'مضاد التهاب' },
  { id: 4, name: 'أومبيرازول', category: 'لعلاج الحموضة' },
  { id: 5, name: 'لوراتادين', category: 'مضاد هيستامين' },
  { id: 6, name: 'ميتفورمين', category: 'لعلاج السكر��' },
  { id: 7, name: 'أملوديبين', category: 'لعلاج ضغط الدم' },
  { id: 8, name: 'أزيثروميسين', category: 'مضاد حيوي' },
  { id: 9, name: 'فيتامين د', category: 'مكمل غذائي' },
  { id: 10, name: 'حديد', category: 'مكمل غذائي' }
];
