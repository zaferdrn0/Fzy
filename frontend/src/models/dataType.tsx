// TypeScript arayüzleri


export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}


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
  status: string;
  date: string | number | Date;
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

