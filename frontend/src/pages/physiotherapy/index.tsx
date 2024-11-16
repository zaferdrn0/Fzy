import { customers } from '@/models/exampleUser';
import { NextPage } from 'next';
import Link from 'next/link';

const PhysiotherapyPage: NextPage = () => {
  // Fizyoterapi hizmetini alan müşterileri filtreleyin
  const physioCustomers = customers.filter((customer) =>
    customer.services.some((service) => service.serviceType === 'physiotherapy')
  );

  // Tüm Fizyoterapi randevularını toplayın
  let allAppointments: Appointment[] = [];
  physioCustomers.forEach((customer) => {
    const physioServices = customer.services.filter((service) => service.serviceType === 'physiotherapy');
    physioServices.forEach((service) => {
      if (service.appointments) {
        allAppointments = allAppointments.concat(
          service.appointments.map((appointment) => ({
            ...appointment,
            customerId: customer._id,
            serviceId: service._id,
            customerName: `${customer.name.first} ${customer.name.last}`,
          }))
        );
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
      <h1>Fizyoterapi Hizmeti Alan Müşteriler</h1>
      {physioCustomers.map((customer) => (
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
          <Link href={`/physiotherapy/appointment/${appointment._id}?customerId=${appointment.customerId}&serviceId=${appointment.serviceId}`}>
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
          <Link href={`/physiotherapy/appointment/${appointment._id}?customerId=${appointment.customerId}&serviceId=${appointment.serviceId}`}>
            <button>Detaylar ve Güncelle</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PhysiotherapyPage;
