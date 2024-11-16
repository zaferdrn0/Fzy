// pages/customers/[customerId]/services/[serviceId]/new-session.tsx

import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useState } from 'react';
import { customers } from '@/models/exampleUser';

const NewSessionOrAppointment: NextPage = () => {
  const router = useRouter();
  const { customerId, serviceId } = router.query;

  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // customers dizisinden ilgili müşteriyi ve hizmeti bulun
  const customer = customers.find((c) => c._id === customerId);
  const service = customer?.services.find((s) => s._id === serviceId);

  if (!customer || !service) {
    return <div>Hizmet bulunamadı.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      setError('Lütfen bir tarih ve saat seçin.');
      return;
    }

    // Yeni seans/randevu oluşturma
    const newItem = {
      _id: `id_${Date.now()}`, // Benzersiz bir ID oluşturun
      date,
      status: 'scheduled',
      notes: notes || null,
    };

    if (service.serviceType === 'pilates') {
      service.sessions = service.sessions || [];
      service.sessions.push(newItem);
    } else if (['physiotherapy', 'massage'].includes(service.serviceType)) {
      service.appointments = service.appointments || [];
      service.appointments.push(newItem);
    }

    // Başarılı işlem sonrası yönlendirme
    router.push(`/customers/${customerId}/services/${serviceId}`);
  };

  return (
    <div>
      <h1>Yeni {service.serviceType === 'pilates' ? 'Seans' : 'Randevu'} Ekle</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Tarih ve Saat:
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Notlar:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Ekle</button>
      </form>
    </div>
  );
};

export default NewSessionOrAppointment;
