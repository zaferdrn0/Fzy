// pages/customers/[customerId]/index.tsx

import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import { customers } from '@/models/exampleUser';

const CustomerDetail: NextPage = () => {
  const router = useRouter();
  const { customerId } = router.query;

  // customers dizisinden ilgili müşteriyi bulun
  const customer = customers.find((c) => c._id === customerId);

  if (!customer) {
    return <div>Müşteri bulunamadı.</div>;
  }

  return (
    <div>
      <h1>{customer.name.first} {customer.name.last}</h1>
      <p>Email: {customer.email}</p>
      <p>Telefon: {customer.phone}</p>
      <p>Yaş: {customer.age}</p>
      <p>Kilo: {customer.weight}</p>

      <h2>Aldığı Hizmetler</h2>
      {customer.services.map((service) => (
        <div key={service._id}>
          <h3>Hizmet Türü: {service.serviceType.toUpperCase()}</h3>
          <p>Toplam Ücret: {service.totalFee}</p>
          <Link href={`/customers/${customer._id}/services/${service._id}`}>
            <button>Detaylar</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CustomerDetail;
