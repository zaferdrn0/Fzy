// pages/pilates/session/[sessionId].tsx

import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useState } from 'react';
import { customers } from '@/models/exampleUser';

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

const SessionDetailPage: NextPage = () => {
  const router = useRouter();
  const { sessionId, customerId, serviceId } = router.query;

  // Müşteri ve hizmeti bulun
  const customer = customers.find((c) => c._id === customerId);
  const service = customer?.services.find((s) => s._id === serviceId);

  if (!customer || !service || !service.sessions) {
    return <div>Seans bulunamadı.</div>;
  }

  const session = service.sessions.find((s) => s._id === sessionId);

  if (!session) {
    return <div>Seans bulunamadı.</div>;
  }

  const [date, setDate] = useState(formatDateTimeLocal(session.date));
  const [status, setStatus] = useState(session.status);
  const [notes, setNotes] = useState(session.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tarihi ISO formatına dönüştür
    const updatedDate = new Date(date).toISOString();

    // Seansı güncelle
    session.date = updatedDate;
    session.status = status as 'attended' | 'missed' | 'scheduled';
    session.notes = notes || null;

    // İsteğe bağlı: Sunucuya güncelleme isteği gönderin

    // Geri yönlendirme
    router.push('/pilates');
  };

  return (
    <div>
      <h1>Seans Detayı ve Güncelleme</h1>
      <p>Müşteri: {customer.name.first} {customer.name.last}</p>
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
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
};

export default SessionDetailPage;
