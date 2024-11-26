import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Chip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { fetchBackendGET } from '@/utils/backendFetch';


interface Address {
  street: string;
  city: string;
  postalCode: string;
}

interface Customer {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthDate: string;
  weight: number;
  address: Address;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  _id: string;
  type: string;
  description: string;
}

interface Appointment {
  _id: string;
  customerId: string;
  serviceId: Service;
  subscriptionId: string | null;
  date: string;
  status: "İleri Tarihli" | "Geldi" | "Gelmedi";
  notes: string;
  fee: number;
  isPaid: boolean;
  createdAt: string;
}

interface Subscription {
  subscriptionId: string;
  startDate: string;
  durationDays: number;
  sessionLimit: number;
  sessionsAttended: number;
  sessionsMissed: number;
  upcomingSessions: number;
  progress: number;
}

interface Payment {
  _id: string;
  customerId: string;
  serviceId: Service;
  subscriptionId: string | null;
  appointmentId: string | null;
  amount: number;
  status: "paid";
  date: string;
  createdAt: string;
}

interface DashboardData {
  customer: Customer;
  upcomingAppointments: Appointment[];
  subscriptions: Subscription[];
  recentPayments: Payment[];
}


const CustomerOverview: React.FC = () => {
  const router = useRouter();
  const { customerId } = router.query;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (customerId) {
      const fetchData = async () => {
        try {
          const response = await fetchBackendGET(`/customer/dashboard/${customerId}`);
          if (response.ok) {
            const result: DashboardData = await response.json();
            setData(result);
          } else {
            console.error('Error fetching dashboard data');
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [customerId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Typography variant="h6" color="error">
        Dashboard verileri alınırken hata oluştu.
      </Typography>
    );
  }

  const { customer, upcomingAppointments, subscriptions, recentPayments } = data;
  return (
<Grid container spacing={3}>

{/* Yaklaşan Randevular */}
<Grid item xs={12} md={6}>
  <Card sx={{ minHeight: '300px' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Icon icon="mdi:calendar-clock" style={{ marginRight: 8, fontSize: 24 }} />
        <Typography variant="h6">
          Yaklaşan Randevular ({upcomingAppointments.length})
        </Typography>
      </Box>
      <Box sx={{ maxHeight: '250px', overflowY: 'auto' }}>
        {upcomingAppointments.length > 0 ? (
          <List>
            {upcomingAppointments.map((appt) => {
              let statusIcon = '';
              let statusColor = '';
              if (appt.status === 'Geldi') {
                statusIcon = 'mdi:check-circle';
                statusColor = 'success.main';
              } else if (appt.status === 'Gelmedi') {
                statusIcon = 'mdi:close-circle';
                statusColor = 'error.main';
              } else if (appt.status === 'İleri Tarihli') {
                statusIcon = 'mdi:clock-outline';
                statusColor = 'info.main';
              } else {
                statusIcon = 'mdi:help-circle';
                statusColor = 'text.secondary';
              }

              return (
                <ListItem key={appt._id}>
                  <ListItemAvatar>
                    <Icon
                      icon={statusIcon}
                      style={{ fontSize: 32, color: statusColor }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {appt.serviceId.type}
                        {appt.subscriptionId && (
                          <Chip
                            label="Abonelik"
                            color="primary"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(appt.date).toLocaleString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                        <Typography variant="body2" color={statusColor}>
                          Durum: {appt.status}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography variant="body2">Yaklaşan randevu yok.</Typography>
        )}
      </Box>
    </CardContent>
  </Card>
</Grid>

  {/* Son Ödemeler */}
  <Grid item xs={12} md={6}>
    <Card sx={{ minHeight: '300px' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Icon icon="mdi:currency-usd" style={{ marginRight: 8, fontSize: 24 }} />
          <Typography variant="h6">Son Ödemeler</Typography>
        </Box>
        <Box sx={{ maxHeight: '250px', overflowY: 'auto' }}>
          {recentPayments.length > 0 ? (
            <List>
              {recentPayments.map((payment) => (
                <ListItem
                  key={payment._id}
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                    mb: 1,
                    pb: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Icon icon="mdi:cash" style={{ fontSize: 32, color: '#4caf50' }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {payment.serviceId.type} - {payment.amount} TL
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {new Date(payment.date).toLocaleDateString('tr-TR')}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">Ödeme bulunamadı.</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  </Grid>

{/* Abonelikler */}
<Grid item xs={12}>
  <Card sx={{ minHeight: '300px' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Icon icon="mdi:account-card-details" style={{ marginRight: 8, fontSize: 24 }} />
        <Typography variant="h6">Abonelikler</Typography>
      </Box>
      {subscriptions.length > 0 ? (
        subscriptions.map((sub) => {
          // Yüzde hesaplamaları
          const totalSessions = sub.sessionsAttended + sub.upcomingSessions;
          const totalProgress = (totalSessions / sub.sessionLimit) * 100;
          const attendedProgress = (sub.sessionsAttended / sub.sessionLimit) * 100;

          return (
            <Card
              key={sub.subscriptionId}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <Icon
                  icon="mdi:clipboard-text"
                  style={{ marginRight: 8, fontSize: 20, color: 'gray' }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {sub.subscriptionId}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Başlangıç: {new Date(sub.startDate).toLocaleDateString('tr-TR')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Toplam Seans: {sub.sessionLimit}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Icon
                  icon="mdi:check-circle"
                  style={{ marginRight: 8, fontSize: 20, color: '#4caf50' }}
                />
                <Typography variant="body2">
                  Katıldığı Seanslar: {sub.sessionsAttended}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Icon
                  icon="mdi:close-circle"
                  style={{ marginRight: 8, fontSize: 20, color: '#f44336' }}
                />
                <Typography variant="body2">
                  Kaçırdığı Seanslar: {sub.sessionsMissed}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Icon
                  icon="mdi:clock-outline"
                  style={{ marginRight: 8, fontSize: 20, color: '#ff9800' }}
                />
                <Typography variant="body2">
                  İleri Tarihli Randevular: {sub.upcomingSessions}
                </Typography>
              </Box>
              <Box mt={1} position="relative">
                <LinearProgress
                  variant="determinate"
                  value={totalProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#ffcc80', // İleri tarihli randevular için arka plan rengi
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#4caf50', // Katıldığı seanslar için renk
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: `${attendedProgress}%`,
                    width: `${totalProgress - attendedProgress}%`,
                    height: '100%',
                    backgroundColor: '#ff9800', // İleri tarihli için renk
                    borderRadius: '0 5px 5px 0',
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mt: 0.5, textAlign: 'right' }}
              >
                Kullanılan Seanslar: %{Math.round(totalProgress)}
              </Typography>
            </Card>
          );
        })
      ) : (
        <Typography variant="body2">Aktif abonelik yok.</Typography>
      )}
    </CardContent>
  </Card>
</Grid>
</Grid>



  );
};

export default CustomerOverview;
