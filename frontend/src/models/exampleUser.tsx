// TypeScript arayüzleri

// Müşteri arayüzü
interface Customer {
    _id: string;
    name: {
      first: string;
      last: string;
    };
    email: string;
    phone: string;
    age: number;
    weight: number;
    services: Service[];
    createdAt: string;
    updatedAt: string;
  }
  
  // Hizmet arayüzü
  interface Service {
    _id: string;
    customer: Customer;
    serviceType: 'pilates' | 'physiotherapy' | 'massage';
    // Hizmete özgü alanlar
    membershipType?: 'basic' | 'premium';
    trainerNotes?: string;
    medicalHistory?: string;
    injuryType?: string;
    doctorNotes?: string;
    massageType?: string;
    preferences?: string;
    totalFee: number;
    payments: Payment[];
    sessions?: Session[];
    appointments?: Appointment[];
    createdAt: string;
    updatedAt: string;
  }
  
  // Ödeme arayüzü
  interface Payment {
    amount: number;
    date: string;
  }
  
  // Seans arayüzü (Pilates için)
  interface Session {
    _id: string;
    date: string;
    status: 'attended' | 'missed' | 'scheduled';
    notes: string | null;
  }
  
  // Randevu arayüzü (Fizyoterapi ve Masaj için)
  interface Appointment {
    _id: string;
    date: string;
    status: 'attended' | 'missed' | 'scheduled';
    notes: string | null;
  }
  // Müşteri 1'in tanımlanması
  const customer1Id = 'customerId1';
  
  const customer1: Customer = {
    _id: customer1Id,
    name: {
      first: 'Ali',
      last: 'Yılmaz',
    },
    email: 'ali.yilmaz@example.com',
    phone: '+905551112233',
    age: 35,
    weight: 78,
    services: [], // Hizmetler daha sonra eklenecek
    createdAt: '2023-07-01T08:00:00Z',
    updatedAt: '2023-09-30T18:00:00Z',
  };
  
  // Müşteri 1'in Pilates Hizmeti
  const pilatesService1Id = 'serviceId1';
  
  const pilatesService1: Service = {
    _id: pilatesService1Id,
    customer: customer1,
    serviceType: 'pilates',
    membershipType: 'premium',
    trainerNotes: 'Esneklik çalışmaları başarılı.',
    totalFee: 1800,
    payments: [
      { amount: 600, date: '2023-07-01T10:00:00Z' },
      { amount: 600, date: '2023-08-01T10:00:00Z' },
      { amount: 600, date: '2023-09-01T10:00:00Z' },
    ],
    sessions: [], // Seanslar daha sonra eklenecek
    createdAt: '2023-07-01T08:00:00Z',
    updatedAt: '2023-09-30T18:00:00Z',
  };
  
  // Müşteri 1'in Pilates Seansları
  const pilatesSession1Id = 'sessionId1';
  const pilatesSession2Id = 'sessionId2';
  const pilatesSessionFutureId = 'sessionIdFuture1';
  
// Müşteri 1'in Pilates Seansları
const pilatesSession1: Session = {
    _id: pilatesSession1Id,
    date: '2023-07-03T09:00:00Z',
    status: 'attended',
    notes: 'Temel hareketler öğrenildi.',
  };
  
  const pilatesSession2: Session = {
    _id: pilatesSession2Id,
    date: '2023-07-05T09:00:00Z',
    status: 'missed',
    notes: 'Müşteri gelmedi.',
  };
  
  const pilatesSessionFuture: Session = {
    _id: pilatesSessionFutureId,
    date: '2023-10-02T09:00:00Z',
    status: 'scheduled',
    notes: null,
  };
  
  // Seansların Hizmete Eklenmesi
  pilatesService1.sessions = [pilatesSession1, pilatesSession2, pilatesSessionFuture];
  
  
  // Müşteri 1'in Masaj Hizmeti
  const massageService1Id = 'serviceId2';
  
  const massageService1: Service = {
    _id: massageService1Id,
    customer: customer1,
    serviceType: 'massage',
    massageType: 'Derin Doku Masajı',
    preferences: 'Nane yağı, orta sertlikte basınç',
    totalFee: 1200,
    payments: [
      { amount: 400, date: '2023-07-03T17:00:00Z' },
      { amount: 400, date: '2023-08-03T17:00:00Z' },
      { amount: 400, date: '2023-09-03T17:00:00Z' },
    ],
    appointments: [], // Randevular daha sonra eklenecek
    createdAt: '2023-07-03T12:00:00Z',
    updatedAt: '2023-09-30T18:00:00Z',
  };
  
  // Müşteri 1'in Masaj Randevuları
  const massageAppointment1Id = 'appointmentId1';
  const massageAppointmentFutureId = 'appointmentIdFuture1';
  
  const massageAppointment1: Appointment = {
    _id: massageAppointment1Id,
    date: '2023-07-07T18:00:00Z',
    status: 'attended',
    notes: 'Kas gevşetme uygulandı.',
  };
  
  const massageAppointmentFuture: Appointment = {
    _id: massageAppointmentFutureId,
    date: '2023-10-04T18:00:00Z',
    status: 'scheduled',
    notes: null,
  };
  
  // Randevuların Hizmete Eklenmesi
  massageService1.appointments = [massageAppointment1, massageAppointmentFuture];
  
  // Hizmetlerin Müşteriye Eklenmesi
  customer1.services = [pilatesService1, massageService1];
  
  // Müşteri 2'nin tanımlanması
  const customer2Id = 'customerId2';
  
  const customer2: Customer = {
    _id: customer2Id,
    name: {
      first: 'Ayşe',
      last: 'Kaya',
    },
    email: 'ayse.kaya@example.com',
    phone: '+905551223344',
    age: 28,
    weight: 62,
    services: [], // Hizmetler daha sonra eklenecek
    createdAt: '2023-07-02T08:00:00Z',
    updatedAt: '2023-09-30T18:00:00Z',
  };
  
  // Müşteri 2'nin Fizyoterapi Hizmeti
  const physioService1Id = 'serviceId3';
  
  const physioService1: Service = {
    _id: physioService1Id,
    customer: customer2,
    serviceType: 'physiotherapy',
    medicalHistory: 'Geçmişte diz sakatlanması.',
    injuryType: 'Sol dizde menisküs yırtığı',
    doctorNotes: 'Rehabilitasyon önerildi.',
    totalFee: 3600,
    payments: [
      { amount: 1200, date: '2023-07-02T14:00:00Z' },
      { amount: 1200, date: '2023-08-02T14:00:00Z' },
      { amount: 1200, date: '2023-09-02T14:00:00Z' },
    ],
    appointments: [], // Randevular daha sonra eklenecek
    createdAt: '2023-07-02T10:00:00Z',
    updatedAt: '2023-09-30T18:00:00Z',
  };
  
  // Müşteri 2'nin Fizyoterapi Randevuları
  const physioAppointment1Id = 'appointmentId2';
  const physioAppointmentFutureId = 'appointmentIdFuture2';
  
  const physioAppointment1: Appointment = {
    _id: physioAppointment1Id,
    date: '2023-07-04T15:00:00Z',
    status: 'attended',
    notes: 'İlk değerlendirme yapıldı.',
  };
  
  const physioAppointmentFuture: Appointment = {
    _id: physioAppointmentFutureId,
    date: '2023-10-03T15:00:00Z',
    status: 'scheduled',
    notes: null,
  };
  
  // Randevuların Hizmete Eklenmesi
  physioService1.appointments = [physioAppointment1, physioAppointmentFuture];
  
  // Müşteri 2'nin Pilates Hizmeti
  const pilatesService2Id = 'serviceId4';
  
  const pilatesService2: Service = {
    _id: pilatesService2Id,
    customer: customer2,
    serviceType: 'pilates',
    membershipType: 'basic',
    trainerNotes: 'Denge çalışmaları geliştirilmeli.',
    totalFee: 1500,
    payments: [
      { amount: 500, date: '2023-07-05T10:00:00Z' },
      { amount: 500, date: '2023-08-05T10:00:00Z' },
      { amount: 500, date: '2023-09-05T10:00:00Z' },
    ],
    sessions: [], // Seanslar daha sonra eklenecek
    createdAt: '2023-07-05T08:00:00Z',
    updatedAt: '2023-09-30T18:00:00Z',
  };
  
  // Müşteri 2'nin Pilates Seansları
  const pilatesSession3Id = 'sessionId3';
  const pilatesSessionFuture2Id = 'sessionIdFuture2';
  
  const pilatesSession3: Session = {
    _id: pilatesSession3Id,
    date: '2023-07-07T09:00:00Z',
    status: 'attended',
    notes: 'Başlangıç seviyesi hareketler.',
  };
  
  const pilatesSessionFuture2: Session = {
    _id: pilatesSessionFuture2Id,
    date: '2023-10-06T09:00:00Z',
    status: 'scheduled',
    notes: null,
  };
  
  // Seansların Hizmete Eklenmesi
  pilatesService2.sessions = [pilatesSession3, pilatesSessionFuture2];
  
  // Hizmetlerin Müşteriye Eklenmesi
  customer2.services = [physioService1, pilatesService2];
  
  // Tüm Müşterileri Bir Dizide Toplama
  export const customers: Customer[] = [customer1, customer2];
  
  // Frontend'de Kullanım ve Sayfa Yapısı İpuçları
  
  // 1. Müşteri Listesi Sayfası (/customers)
  // - customers dizisini kullanarak tüm müşterileri listeleyin.
  // - Her müşterinin adı, soyadı ve iletişim bilgilerini gösterin.
  // - Müşteri adına tıklayarak müşteri detay sayfasına yönlendirin.
  
  // 2. Müşteri Detay Sayfası (/customers/[id])
  // - URL'den gelen id parametresini kullanarak ilgili müşteriyi bulun.
  // - customer.services dizisini kullanarak müşterinin aldığı hizmetleri listeleyin.
  // - Hizmet adına tıklayarak hizmet detay sayfasına yönlendirin.
  
  // 3. Hizmet Detay Sayfası (/customers/[customerId]/services/[serviceId])
  // - URL'den gelen customerId ve serviceId parametrelerini kullanarak hizmeti bulun.
  // - Hizmete özgü bilgileri (örneğin, pilates için membershipType, trainerNotes) gösterin.
  // - Ödemeleri ve seansları/randevuları listeleyin.
  // - Yeni seans/randevu ekleme butonu ekleyin.
  
  // 4. Yeni Seans/Randevu Ekleme Sayfası (/customers/[customerId]/services/[serviceId]/new-session)
  // - Form aracılığıyla yeni seans veya randevu bilgilerini alın.
  // - Form verilerini ilgili hizmetin sessions veya appointments dizisine ekleyin.
  
  // Verileri Frontend'de Kullanma Örneği:
  
  // Müşteri Listesini Gösterme
  customers.forEach((customer) => {
    console.log(`${customer.name.first} ${customer.name.last}`);
    // Müşteri detay sayfasına yönlendirme linki oluşturun
  });
  
  // Seçili Müşterinin Hizmetlerini Gösterme
  const selectedCustomerId = 'customerId1'; // Örnek olarak
  const selectedCustomer = customers.find((c) => c._id === selectedCustomerId);
  
  if (selectedCustomer) {
    selectedCustomer.services.forEach((service) => {
      console.log(`Hizmet Türü: ${service.serviceType}`);
      // Hizmet detay sayfasına yönlendirme linki oluşturun
    });
  }
  
  // Hizmet Detaylarını Gösterme
  const selectedServiceId = 'serviceId1'; // Örnek olarak
  const selectedService = selectedCustomer?.services.find((s) => s._id === selectedServiceId);
  
  if (selectedService) {
    console.log(`Hizmet Türü: ${selectedService.serviceType}`);
    console.log(`Toplam Ücret: ${selectedService.totalFee}`);
    // Hizmete özgü alanları gösterin
    if (selectedService.serviceType === 'pilates') {
      console.log(`Üyelik Tipi: ${selectedService.membershipType}`);
      console.log(`Eğitmen Notları: ${selectedService.trainerNotes}`);
      // Seansları listeleyin
      selectedService.sessions?.forEach((session) => {
        console.log(`Seans Tarihi: ${session.date}, Durum: ${session.status}`);
      });
    }
  }
  
  // Yeni Seans Ekleme Fonksiyonu
  function addNewSession(service: Service, session: Session) {
    if (service.serviceType === 'pilates') {
      service.sessions?.push(session);
    } else {
      console.log('Bu hizmet için seans eklenemez.');
    }
  }
  
  // Örnek Yeni Seans Ekleme
  const newSession: Session = {
    _id: 'sessionIdNew',
    date: '2023-10-10T09:00:00Z',
    status: 'scheduled',
    notes: null,
  };
  
  if (selectedService) {
    addNewSession(selectedService, newSession);
  }
  