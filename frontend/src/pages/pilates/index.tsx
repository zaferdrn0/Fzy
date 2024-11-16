import { customers } from '@/models/exampleUser';
import { NextPage } from 'next';
import Link from 'next/link';

const PilatesPage: NextPage = () => {
  // Pilates hizmetini alan müşterileri filtreleyin
  const pilatesCustomers = customers.filter((customer) =>
    customer.services.some((service) => service.serviceType === 'pilates')
  );

  // Tüm Pilates seanslarını toplayın
  let allSessions: Session[] = [];
  pilatesCustomers.forEach((customer) => {
    const pilatesServices = customer.services.filter((service) => service.serviceType === 'pilates');
    pilatesServices.forEach((service) => {
      if (service.sessions) {
        allSessions = allSessions.concat(service.sessions.map((session) => ({
          ...session,
          customerId: customer._id,
          serviceId: service._id,
          customerName: `${customer.name.first} ${customer.name.last}`,
        })));
      }
    });
  });

  // Seansları gelecek ve geçmiş olarak ayırın
  const now = new Date();
  const upcomingSessions = allSessions.filter(
    (session) => session.status === 'scheduled' && new Date(session.date) >= now
  );
  const pastSessions = allSessions.filter(
    (session) => session.status !== 'scheduled' || new Date(session.date) < now
  );

  return (
    <div>
      <h1>Pilates Hizmeti Alan Müşteriler</h1>
      {pilatesCustomers.map((customer) => (
        <div key={customer._id}>
          <p>{customer.name.first} {customer.name.last}</p>
          <Link href={`/customers/${customer._id}`}>
            <button>Detaylar</button>
          </Link>
        </div>
      ))}

      <h2>Gelecek Seanslar</h2>
      {upcomingSessions.map((session) => (
        <div key={session._id}>
          <p>
            Tarih: {session.date} - Durum: {session.status} - Müşteri: {session.customerName}
          </p>
          <Link href={`/pilates/session/${session._id}?customerId=${session.customerId}&serviceId=${session.serviceId}`}>
            <button>Detaylar ve Güncelle</button>
          </Link>
        </div>
      ))}

      <h2>Geçmiş Seanslar</h2>
      {pastSessions.map((session) => (
        <div key={session._id}>
          <p>
            Tarih: {session.date} - Durum: {session.status} - Müşteri: {session.customerName}
          </p>
          <Link href={`/pilates/session/${session._id}?customerId=${session.customerId}&serviceId=${session.serviceId}`}>
            <button>Detaylar ve Güncelle</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PilatesPage;
