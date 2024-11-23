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
  endDate: string;
  sessionLimit: number;
  makeupSessions: number;
  fee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Appointment Interface
export interface Appointment {
  _id: string;
  customerId?: string;
  serviceId: string;
  subscriptionId?: string | null;
  date: string;
  status: 'Geldi' | 'Kaçırdı' | 'İleri Tarihli';
  notes: string | null;
  fee: number;
  isPaid: boolean;
  createdAt: string;
}

export const customerData: Customer[] =[{
  "_id": "60d5f9f8fc13ae1df9000001",
  "name": "Mehmet",
  "surname": "Yılmaz",
  "email": "mehmet.yilmaz@example.com",
  "phone": "+905312345678",
  "birthDate": "1985-05-15T00:00:00Z",
  "weight": 80,
  "address": {
    "street": "Atatürk Cad. No:123",
    "city": "İstanbul",
    "postalCode": "34000"
  },
  "isActive": true,
  "createdAt": "2023-06-01T09:30:00Z",
  "updatedAt": "2024-11-21T12:00:00Z",
  "services": [
    {
      "_id": "60d5fa1ffc13ae1df9000002",
      "type": "Pilates",
      "description": "30 günlük abonelik ile pilates dersleri.",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-11-20T10:00:00Z"
    },
    {
      "_id": "60d5fac0fc13ae1df9000007",
      "type": "Fizyoterapi",
      "description": "Bireysel fizyoterapi seansları.",
      "createdAt": "2024-01-05T10:00:00Z",
      "updatedAt": "2024-11-20T10:00:00Z"
    }
  ],
  "subscriptions": [
    {
      "_id": "60d5fa3bfc13ae1df9000003",
      "serviceId": "60d5fa1ffc13ae1df9000002",
      "durationDays": 30,
      "startDate": "2024-01-10T10:00:00Z",
      "endDate": "2024-02-09T10:00:00Z",
      "sessionLimit": 8,
      "makeupSessions": 1,
      "fee": 200,
      "isActive": true,
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-11-20T10:00:00Z"
    }
  ],
  "appointments": [
    {
      "_id": "60d5fa5ffc13ae1df9000004",
      "serviceId": "60d5fa1ffc13ae1df9000002",
      "subscriptionId": "60d5fa3bfc13ae1df9000003",
      "date": "2024-12-05T10:00:00Z",
      "status": "İleri Tarihli",
      "notes": "Başlangıç seansı",
      "fee": 50,
      "isPaid": false,
      "createdAt": "2024-11-21T10:00:00Z"
    },
    {
      "_id": "60d5fa6ffc13ae1df900000a",
      "serviceId": "60d5fa1ffc13ae1df9000002",
      "subscriptionId": "60d5fa3bfc13ae1df9000003",
      "date": "2024-01-15T10:00:00Z",
      "status": "Geldi",
      "notes": "İlk seans tamamlandı.",
      "fee": 50,
      "isPaid": true,
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ],
  "payments": [
    {
      "_id": "60d5fa7cfc13ae1df9000005",
      "serviceId": "60d5fa1ffc13ae1df9000002",
      "subscriptionId": "60d5fa3bfc13ae1df9000003",
      "appointmentId": "60d5fa5ffc13ae1df9000004",
      "amount": 200,
      "status": "Ödendi",
      "date": "2024-01-10T10:00:00Z",
      "createdAt": "2024-01-10T10:00:00Z"
    },
    {
      "_id": "60d5fa8cfc13ae1df900000b",
      "serviceId": "60d5fa1ffc13ae1df9000002",
      "appointmentId": "60d5fa6ffc13ae1df900000a",
      "amount": 50,
      "status": "Ödendi",
      "date": "2024-01-15T11:00:00Z",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}]