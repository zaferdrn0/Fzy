import { Customer, Service } from '@/models/dataType';
import { getMembershipStatus } from '@/utils/isMembershipActive';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Grid, Paper, Typography, Box, Chip, LinearProgress, List, ListItem, ListItemText, Button, Fade, Modal } from '@mui/material';
import React, { useState } from 'react';

const MemberShipDetail = ({ customer }: { customer: Customer }) => {
  const today = new Date();
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setOpenModal(false);
  };
  const allEvents = customer.services.flatMap((service) =>
    service.events.map((event) => ({
      ...event,
      serviceType: service.serviceType, 
    }))
  );

  return (
    <Grid container spacing={3}>
        <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={openModal}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              padding: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Üyelik Detayları
            </Typography>
            {selectedService && (
              <Box>
                {selectedService.membershipStartDate &&
                <Typography variant="body2" color="text.secondary" gutterBottom>
                Başlangıç Tarihi: {new Date(selectedService?.membershipStartDate).toLocaleDateString()}
              </Typography>}
                {selectedService.membershipDuration &&
                 <Typography variant="body2" color="text.secondary" gutterBottom>
                 Süre: {selectedService.membershipDuration} gün
               </Typography>}
               
                {selectedService.trainerNotes && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Eğitmen Notları: {selectedService.trainerNotes}
                  </Typography>
                )}
                {selectedService.medicalHistory && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tıbbi Geçmiş: {selectedService.medicalHistory}
                  </Typography>
                )}
                {selectedService.injuryType && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Yaralanma Türü: {selectedService.injuryType}
                  </Typography>
                )}
                {selectedService.preferences && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tercihler: {selectedService.preferences}
                  </Typography>
                )}
                {selectedService.massageType && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Masaj Türü: {selectedService.massageType}
                  </Typography>
                )}
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button variant="contained" onClick={handleCloseModal}>
                    Kapat
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Fade>
      </Modal>
    {/* Membership Status */}
    <Grid item xs={12}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon icon="mdi:card-account-details" width={24} height={24} style={{ marginRight: 8 }} />
          Üyelik Durumu
        </Typography>
        <Grid container spacing={2}>
          {customer.services.map((service) => (
            <Grid item xs={12} md={12} key={service._id}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  backgroundColor: service.membershipType === 'premium' ? 'action.hover' : 'transparent',
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Icon
                    icon={
                      service.serviceType === 'pilates'
                        ? 'mdi:yoga'
                        : service.serviceType === 'massage'
                        ? 'mdi:hand-heart'
                        : 'mdi:doctor'
                    }
                    width={20}
                    height={20}
                    style={{ marginRight: 8 }}
                  />
                  {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)}
                  {service.membershipType && (
                    <Chip
                      label={service.membershipType}
                      size="small"
                      color={service.membershipType === 'premium' ? 'primary' : 'default'}
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Ücret: {service.totalFee |0} TL
                  </Typography>
                  {service.membershipStartDate && (
                    <Typography variant="body2" color="text.secondary">
                      {(() => {
                        const { isActive, daysLeft } = getMembershipStatus(
                          service.membershipStartDate,
                          service.membershipDuration
                        );
                        return isActive
                          ? `Kalan Süre: ${Math.ceil(daysLeft / 30)} ay (${daysLeft} gün)`
                          : 'Expired';
                      })()}
                    </Typography>
                  )}
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleOpenModal(service)}
                >
                  Detaylar
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Grid>
      
      {/* Yaklaşan Randevular */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon="mdi:calendar-clock" width={24} height={24} style={{ marginRight: 8 }} />
            Yaklaşan Randevular
          </Typography>
          {(() => {
            const upcomingEvents = allEvents
              .filter((event) => new Date(event.date) > today)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3);

            return upcomingEvents.length > 0 ? (
              <List dense>
                {upcomingEvents.map((event) => (
                  <ListItem
                    key={event._id}
                    sx={{
                      borderLeft: 2,
                      borderColor: 'primary.main',
                      mb: 1,
                      backgroundColor: 'background.paper',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {new Date(event.date).toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Icon
                            icon={
                              event.serviceType === 'pilates'
                                ? 'mdi:yoga'
                                : event.serviceType === 'massage'
                                ? 'mdi:hand-heart'
                                : 'mdi:doctor'
                            }
                            width={16}
                            height={16}
                            style={{ marginRight: 4 }}
                          />
                          {event.serviceType}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Icon icon="mdi:calendar-blank" width={40} height={40} style={{ opacity: 0.5 }} />
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Yaklaşan randevu bulunmuyor
                </Typography>
              </Box>
            );
          })()}
        </Paper>
      </Grid>

      {/* Aktivite Özeti */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon="mdi:chart-box" width={24} height={24} style={{ marginRight: 8 }} />
            Aktivite Özeti
          </Typography>
          {(() => {
            const completedEvents = allEvents.filter((event) => event.status === 'attended');
            const missedEvents = allEvents.filter((event) => event.status === 'missed');
            const attendanceRate =
              allEvents.length > 0 ? (completedEvents.length / allEvents.length) * 100 : 0;

            return (
              <Box>
                <LinearProgress
                  variant="determinate"
                  value={attendanceRate}
                  sx={{ height: 10, borderRadius: 5, mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Katılım Oranı
                    </Typography>
                    <Typography variant="h6">{attendanceRate.toFixed(1)}%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Toplam Seans
                    </Typography>
                    <Typography variant="h6">{allEvents.length}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Tamamlanan
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {completedEvents.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Kaçırılan
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {missedEvents.length}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            );
          })()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MemberShipDetail;
