// pages/customers/[customerId]/services/[serviceId]/index.tsx

import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { customers } from '@/models/exampleUser';

const ServiceDetail: NextPage = () => {
  const router = useRouter();
  const { customerId, serviceId } = router.query;

  // customers dizisini import edin veya API'den çekin
  // Örnek için doğrudan import edelim
  // import { customers } from '../../../../data/customers';

  const [updated, setUpdated] = useState(false); // Güncelleme sonrası yeniden render için

  // İlgili müşteri ve hizmeti bulun
  const customer = customers.find((c) => c._id === customerId);
  const service = customer?.services.find((s) => s._id === serviceId);

  if (!customer || !service) {
    return <div>Hizmet bulunamadı.</div>;
  }

  // Geçmiş ve gelecek seansları/randevuları ayırma
  const now = new Date();

  let pastItems = [];
  let upcomingItems = [];

  if (service.serviceType === 'pilates' && service.sessions) {
    upcomingItems = service.sessions.filter(
      (s) => s.status === 'scheduled'
    );
    pastItems = service.sessions.filter(
      (s) => s.status !== 'scheduled'
    );
  } else if (['physiotherapy', 'massage'].includes(service.serviceType) && service.appointments) {
    upcomingItems = service.appointments.filter(
      (a) => a.status === 'scheduled'
    );
    pastItems = service.appointments.filter(
      (a) => a.status !== 'scheduled'
    );
  }

  // Seans/Randevu güncelleme fonksiyonu
  const handleUpdateItem = (item) => {
    // Güncelleme sayfasına yönlendirme
    router.push({
      pathname: `/customers/${customer._id}/services/${service._id}/update-session`,
      query: { itemId: item._id },
    });
  };

  return (
    <div>
      <h1>{service.serviceType.toUpperCase()} Hizmeti</h1>
      {/* Hizmete özgü bilgileri gösterin */}
      {/* ... */}

      <h2>Ödeme Geçmişi</h2>
      {service.payments.map((payment, index) => (
        <div key={index}>
          <p>Tutar: {payment.amount} - Tarih: {payment.date}</p>
        </div>
      ))}

      <h2>Gelecek {service.serviceType === 'pilates' ? 'Seanslar' : 'Randevular'}</h2>
      {upcomingItems.map((item) => (
        <div key={item._id}>
          <p>Tarih: {item.date} - Durum: {item.status}</p>
          <p>Notlar: {item.notes}</p>
          {/* Güncelleme butonu */}
          <button onClick={() => handleUpdateItem(item)}>Güncelle</button>
        </div>
      ))}

      <h2>Geçmiş {service.serviceType === 'pilates' ? 'Seanslar' : 'Randevular'}</h2>
      {pastItems.map((item) => (
        <div key={item._id}>
          <p>Tarih: {item.date} - Durum: {item.status}</p>
          <p>Notlar: {item.notes}</p>
          {/* Güncelleme butonu */}
          <button onClick={() => handleUpdateItem(item)}>Güncelle</button>
        </div>
      ))}

      <Link href={`/customers/${customer._id}/services/${service._id}/new-session`}>
        <button>Yeni {service.serviceType === 'pilates' ? 'Seans' : 'Randevu'} Ekle</button>
      </Link>
    </div>
  );
};

export default ServiceDetail;
