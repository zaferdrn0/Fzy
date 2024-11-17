// TypeScript arayüzleri

export interface Customer {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  birthDate: string;
  weight: number;
  services: Service[];
  createdAt: string;
  updatedAt: string;
}

// Ödeme arayüzü
export interface Payment {
  amount: number;
  date: string;
}
  // Hizmet arayüzü
export interface Service {
  _id: string;
  customer: Customer;
  serviceType: 'pilates' | 'physiotherapy' | 'massage';
  // Hizmete özgü alanlar
  membershipType?: 'basic' | 'premium';
  membershipDuration?: number; 
  membershipStartDate?: string;
  trainerNotes?: string;
  medicalHistory?: string;
  injuryType?: string;
  doctorNotes?: string;
  massageType?: string;
  preferences?: string;
  totalFee: number;
  payments: Payment[];
  events?: Event[]; // Tek bir etkinlik dizisi
  createdAt: string;
  updatedAt: string;
}

// Etkinlik arayüzü (Tüm hizmetler için)
export interface Event {
  _id: string;
  date: string;
  status: 'attended' | 'missed' | 'scheduled';
  notes: string | null;
}

const customer1Id = 'customerId1';

const customer1: Customer = {
  _id: customer1Id,
  name: {
    first: 'Ali',
    last: 'Yılmaz',
  },
  email: 'ali.yilmaz@example.com',
  phone: '+905551112233',
  birthDate: '1988-05-15',
  weight: 78,
  services: [], // Hizmetler daha sonra eklenecek
  createdAt: '2023-07-01T08:00:00Z',
  updatedAt: '2023-09-30T18:00:00Z',
};
  
const pilatesService1Id = 'serviceId1';

const pilatesService1: Service = {
  _id: pilatesService1Id,
  customer: customer1,
  serviceType: 'pilates',
  membershipType: 'premium',
  membershipDuration: 6, // 6 aylık üyelik
  trainerNotes: 'Esneklik çalışmaları başarılı.',
  totalFee: 1800,
  payments: [
    { amount: 600, date: '2023-07-01T10:00:00Z' },
    { amount: 600, date: '2023-08-01T10:00:00Z' },
    { amount: 600, date: '2023-09-01T10:00:00Z' },
  ],
  events: [], // Etkinlikler daha sonra eklenecek
  createdAt: '2023-07-01T08:00:00Z',
  updatedAt: '2023-09-30T18:00:00Z',
};
const pilatesEvent1Id = 'eventId1';
const pilatesEvent2Id = 'eventId2';
const pilatesEventFutureId = 'eventIdFuture1';

const pilatesEvent1: Event = {
  _id: pilatesEvent1Id,
  date: '2023-07-03T09:00:00Z',
  status: 'attended',
  notes: 'Temel hareketler öğrenildi.',
};

const pilatesEvent2: Event = {
  _id: pilatesEvent2Id,
  date: '2023-07-05T09:00:00Z',
  status: 'missed',
  notes: 'Müşteri gelmedi.',
};

const pilatesEventFuture: Event = {
  _id: pilatesEventFutureId,
  date: '2023-10-02T09:00:00Z',
  status: 'scheduled',
  notes: null,
};

// Etkinliklerin Hizmete Eklenmesi
pilatesService1.events = [pilatesEvent1, pilatesEvent2, pilatesEventFuture];

  
  
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
  events: [], // Etkinlikler daha sonra eklenecek
  createdAt: '2023-07-03T12:00:00Z',
  updatedAt: '2023-09-30T18:00:00Z',
};
  
const massageEvent1Id = 'eventId3';
const massageEventFutureId = 'eventIdFuture2';

const massageEvent1: Event = {
  _id: massageEvent1Id,
  date: '2023-07-07T18:00:00Z',
  status: 'attended',
  notes: 'Kas gevşetme uygulandı.',
};

const massageEventFuture: Event = {
  _id: massageEventFutureId,
  date: '2023-10-04T18:00:00Z',
  status: 'scheduled',
  notes: null,
};

// Etkinliklerin Hizmete Eklenmesi
massageService1.events = [massageEvent1, massageEventFuture];
  
  // Hizmetlerin Müşteriye Eklenmesi
  customer1.services = [pilatesService1, massageService1];
  
  const customer2Id = 'customerId2';

  const customer2: Customer = {
    _id: customer2Id,
    name: {
      first: 'Ayşe',
      last: 'Kaya',
    },
    email: 'ayse.kaya@example.com',
    phone: '+905551223344',
    birthDate: '1988-05-15',
    weight: 62,
    services: [], // Hizmetler daha sonra eklenecek
    createdAt: '2023-07-02T08:00:00Z',
    updatedAt: '2023-09-30T18:00:00Z',
  };
  
  
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
    events: [], // Etkinlikler daha sonra eklenecek
    createdAt: '2023-07-02T10:00:00Z',
    updatedAt: '2023-09-30T18:00:00Z',
  };

const physioEvent1Id = 'eventId4';
const physioEventFutureId = 'eventIdFuture3';

const physioEvent1: Event = {
  _id: physioEvent1Id,
  date: '2023-07-04T15:00:00Z',
  status: 'attended',
  notes: 'İlk değerlendirme yapıldı.',
};

const physioEventFuture: Event = {
  _id: physioEventFutureId,
  date: '2023-10-03T15:00:00Z',
  status: 'scheduled',
  notes: null,
};

// Etkinliklerin Hizmete Eklenmesi
physioService1.events = [physioEvent1, physioEventFuture];

  
const pilatesService2Id = 'serviceId4';

const pilatesService2: Service = {
  _id: pilatesService2Id,
  customer: customer2,
  serviceType: 'pilates',
  membershipDuration: 6, // 6 aylık üyelik
  membershipType: 'basic',
  trainerNotes: 'Denge çalışmaları geliştirilmeli.',
  totalFee: 1500,
  payments: [
    { amount: 500, date: '2023-07-05T10:00:00Z' },
    { amount: 500, date: '2023-08-05T10:00:00Z' },
    { amount: 500, date: '2023-09-05T10:00:00Z' },
  ],
  events: [], // Etkinlikler daha sonra eklenecek
  createdAt: '2023-07-05T08:00:00Z',
  updatedAt: '2023-09-30T18:00:00Z',
};

const pilatesEvent3Id = 'eventId5';
const pilatesEventFuture2Id = 'eventIdFuture4';

const pilatesEvent3: Event = {
  _id: pilatesEvent3Id,
  date: '2023-07-07T09:00:00Z',
  status: 'attended',
  notes: 'Başlangıç seviyesi hareketler.',
};

const pilatesEventFuture2: Event = {
  _id: pilatesEventFuture2Id,
  date: '2023-10-06T09:00:00Z',
  status: 'scheduled',
  notes: null,
};

// Etkinliklerin Hizmete Eklenmesi
pilatesService2.events = [pilatesEvent3, pilatesEventFuture2];

  
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
  

  