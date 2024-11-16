// pages/customers/[customerId]/services/[serviceId]/update-session.tsx

import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useState } from 'react';
import { customers } from '@/models/exampleUser';

// ... customers dizisini import edin

function formatDateTimeLocal(dateString: string) {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Aylar 0-11 arasıdır
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const UpdateSessionOrAppointment: NextPage = () => {
  const router = useRouter();
  const { customerId, serviceId, itemId } = router.query;

  // Müşteri ve hizmeti bulun
  const customer = customers.find((c) => c._id === customerId);
  const service = customer?.services.find((s) => s._id === serviceId);

  if (!customer || !service) {
    return <div>Hizmet bulunamadı.</div>;
  }

  // Güncellenecek seans veya randevuyu bulun
  let item;
  if (service.serviceType === 'pilates' && service.sessions) {
    item = service.sessions.find((s) => s._id === itemId);
  } else if (['physiotherapy', 'massage'].includes(service.serviceType) && service.appointments) {
    item = service.appointments.find((a) => a._id === itemId);
  }

  if (!item) {
    return <div>Seans/Randevu bulunamadı.</div>;
  }

  const [date, setDate] = useState(formatDateTimeLocal(item.date));
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !status) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    // Tarih değerini ISO formatına dönüştür
    const updatedDate = new Date(date).toISOString();

    // Seans/Randevuyu güncelle
    item.date = updatedDate;
    item.status = status as 'attended' | 'missed' | 'scheduled';
    item.notes = notes || null;

    // Hizmet detay sayfasına yönlendirme
    router.push(`/customers/${customerId}/services/${serviceId}`);
  };

  return (
    <div>
      <h1>
        {service.serviceType.toUpperCase()} {service.serviceType === 'pilates' ? 'Seans' : 'Randevu'} Güncelle
      </h1>
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
          Durum:
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="scheduled">Planlandı</option>
            <option value="attended">Katıldı</option>
            <option value="missed">Kaçırdı</option>
          </select>
        </label>
        <br />
        <label>
          Notlar:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <br />
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
};

export default UpdateSessionOrAppointment;
