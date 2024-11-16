import { customers } from '@/models/exampleUser';
import { NextPage } from 'next';
import Link from 'next/link';

const MassagePage: NextPage = () => {
  // Masaj hizmetini alan müşterileri filtreleyin
  const massageCustomers = customers.filter((customer) =>
    customer.services.some((service) => service.serviceType === 'massage')
  );

  // Tüm Masaj randevularını toplayın
  let allAppointments: Appointment[] = [];
  massageCustomers.forEach((customer) => {
    const massageServices = customer.services.filter((service) => service.serviceType === 'massage');
    massageServices.forEach((service) => {
      if (service.appointments) {
        allAppointments = allAppointments.concat(service.appointments.map((appointment) => ({
          ...appointment,
          customerId: customer._id,
          serviceId: service._id,
          customerName: `${customer.name.first} ${customer.name.last}`,
        })));
      }
    });
  });

  // Randevuları gelecek ve geçmiş olarak ayırın
  const now = new Date();
  const upcomingAppointments = allAppointments.filter(
    (appointment) => appointment.status === 'scheduled' && new Date(appointment.date) >= now
  );
  const pastAppointments = allAppointments.filter(
    (appointment) => appointment.status !== 'scheduled' || new Date(appointment.date) < now
  );

  return (
    <div>
      <h1>Masaj Hizmeti Alan Müşteriler</h1>
      {massageCustomers.map((customer) => (
        <div key={customer._id}>
          <p>{customer.name.first} {customer.name.last}</p>
          <Link href={`/customers/${customer._id}`}>
            <button>Detaylar</button>
          </Link>
        </div>
      ))}

      <h2>Gelecek Randevular</h2>
      {upcomingAppointments.map((appointment) => (
        <div key={appointment._id}>
          <p>
            Tarih: {appointment.date} - Durum: {appointment.status} - Müşteri: {appointment.customerName}
          </p>
          <Link href={`/massage/appointment/${appointment._id}?customerId=${appointment.customerId}&serviceId=${appointment.serviceId}`}>
            <button>Detaylar ve Güncelle</button>
          </Link>
        </div>
      ))}

      <h2>Geçmiş Randevular</h2>
      {pastAppointments.map((appointment) => (
        <div key={appointment._id}>
          <p>
            Tarih: {appointment.date} - Durum: {appointment.status} - Müşteri: {appointment.customerName}
          </p>
          <Link href={`/massage/appointment/${appointment._id}?customerId=${appointment.customerId}&serviceId=${appointment.serviceId}`}>
            <button>Detaylar ve Güncelle</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MassagePage;
