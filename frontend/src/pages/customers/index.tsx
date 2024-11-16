// pages/customers/index.tsx

import { customers } from '@/models/exampleUser';
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';

const CustomerList: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // customers dizisini import edin veya API'den çekin
  // Örnek için doğrudan import edelim
  // import { customers } from '../../data/customers';

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name.first} ${customer.name.last}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Müşteri Listesi</h1>
      <input
        type="text"
        placeholder="Müşteri ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link href="/customers/new">
        <button>Yeni Müşteri Ekle</button>
      </Link>
      {filteredCustomers.map((customer) => (
        <div key={customer._id}>
          <h2>{customer.name.first} {customer.name.last}</h2>
          <p>Email: {customer.email}</p>
          <p>Telefon: {customer.phone}</p>
          <Link href={`/customers/${customer._id}`}>
            <button>Detaylar</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
