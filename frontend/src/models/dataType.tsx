// TypeScript arayüzleri


export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}


// Customer Interface
export interface Customer {
  _id: string;
  name: string; // Verdiğiniz JSON'da name düz string olarak geçiyor.
  surname: string;
  email: string;
  phone: string;
  birthDate: string;
  weight: number;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  services: Service[]; // İlişkilendirilmiş hizmetler
  subscriptions: Subscription[]; // İlişkilendirilmiş abonelikler
  appointments: Appointment[]; // İlişkilendirilmiş randevular
  payments: Payment[]; // İlişkilendirilmiş ödemeler
}

// Payment Interface
export interface Payment {
  _id: string;
  serviceId: string;
  subscriptionId?: string | null;
  appointmentId?: string | null;
  amount: number;
  status: 'Ödendi' | 'Bekliyor';
  date: string;
  createdAt: string;
}

// Service Interface
export interface Service {
  _id: string;
  type: string; // Verinizde "Pilates", "Fizyoterapi", "Masaj" gibi string değerler var.
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Subscription Interface
export interface Subscription {
  _id: string;
  customerId?: string;
  serviceId: string;
  durationDays: number;
  startDate: string;
  sessionLimit: number;
  makeupSessions: number;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string; // MongoDB ID'si
  customerId: string; // Müşteri ID'si
  serviceId: string; // Hizmet ID'si
  subscriptionId?: string | null; // Abonelik ID'si (opsiyonel)
  date: string; // Randevu tarihi (ISO formatında)
  status: 'İleri Tarihli' | 'Geldi' | 'Gelmedi'; // Randevu durumu
  notes?: string; // Notlar (opsiyonel)
  fee: number; // Ücret
  isPaid: boolean; // Ödeme durumu
  doctorReport?: {
    diagnosis?: string; // Doktor teşhisi (opsiyonel)
    injuryType?: string; // Yaralanma türü (opsiyonel)
    notes?: string; // Doktor notları (opsiyonel)
  }; // Doktor raporu (opsiyonel)
  massageDetails?: {
    massageType?: string; // Masaj türü (opsiyonel)
    notes?: string; // Masaj notları (opsiyonel)
  }; // Masaj detayları (opsiyonel)
  createdAt: string; // Oluşturulma tarihi (ISO formatında)
}

