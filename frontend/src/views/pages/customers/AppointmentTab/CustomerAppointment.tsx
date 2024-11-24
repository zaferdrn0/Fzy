import React, { useState, useMemo, useEffect, Dispatch, SetStateAction } from 'react';
import {
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Button,
    ButtonGroup,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Card,
    CardContent,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Customer, Service, Appointment } from '@/models/dataType';
import AddAppointmentModal from '@/components/appointments/AddAppointmentModal';
import UpdateAppointmentModal from '@/components/appointments/UpdateAppointmentModal';
import { fetchBackendPOST, fetchBackendPUT, fetchBackendDELETE, fetchBackendGET } from '@/utils/backendFetch';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { useRouter } from 'next/router';

interface CustomerAppointmentsProps {
    services: Service[] | null;
}

const CustomerAppointments: React.FC<CustomerAppointmentsProps> = ({

    services,
}) => {
    const [selectedFilter, setSelectedFilter] = useState<
        'İleri Tarihli' | 'Gelmedi' | 'Geldi' | 'Hepsi'
    >('Hepsi');
    const [openAppointmentModal, setOpenAppointmentModal] = useState<boolean>(false);
    const [openAppointmentUpdateModal, setOpenUpdateAppointmentModal] = useState<boolean>(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [overdueAppointments, setOverdueAppointments] = useState<Appointment[]>([]);
    const [openOverdueDialog, setOpenOverdueDialog] = useState<boolean>(false);
    const [statusToUpdate, setStatusToUpdate] = useState<string>('Geldi');
    const [notesToUpdate, setNotesToUpdate] = useState<{ [id: string]: string }>({});
    const [appointments, setAppointments] = useState<Appointment[] | null>(null);
    const router = useRouter()
    const { customerId } = router.query;



    const fetchAppointments = async () => {
        try {
            const response = await fetchBackendGET(`/appointment/${customerId}`);
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else {
                setAppointments(null);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments(null);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [customerId]);

    const handleUpdateStatus = async (appointmentId: string) => {
        try {
            const response = await fetchBackendPUT(`/appointment/status/${appointmentId}`, {
                status: statusToUpdate,
                notes: notesToUpdate[appointmentId], // Güncellenmiş notes
            });
    
            if (response.ok) {
                const { appointment } = await response.json(); // Yanıttan `appointment` objesini al
    
                // appointments state'ini güncelle
                setAppointments((prev) =>
                    prev
                        ? prev.map((appt) =>
                              appt._id === appointment._id ? appointment : appt
                          )
                        : null
                );
    
                // Güncellenmiş randevuyu overdue listeden çıkar
                setOverdueAppointments((prev) =>
                    prev.filter((appt) => appt._id !== appointmentId)
                );
    
                // Modalı kapat
                setOpenOverdueDialog((prev) => overdueAppointments.length <= 1 ? false : prev);
    
                alert('Appointment status and notes updated successfully.');
            } else {
                const error = await response.json();
                alert(`Error updating status: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating appointment status and notes:', error);
            alert('An unexpected error occurred while updating status.');
        }
    };
    const handleUpdateAppointment = async (data: {
        appointmentId: string;
        date?: string;
        notes?: string;
        fee?: number;
        isPaid?: boolean;
        doctorReport?: {
            diagnosis?: string;
            injuryType?: string;
            notes?: string;
        };
        massageDetails?: {
            massageType?: string;
            notes?: string;
        };
    }) => {
        try {
            const response = await fetchBackendPUT(`/appointment/${data.appointmentId}`, data);
    
            if (response.ok) {
                const { appointment } = await response.json(); // Yanıttan `appointment` objesini al
    
                // appointments state'ini güncelle
                setAppointments((prev) =>
                    prev
                        ? prev.map((appt) =>
                              appt._id === appointment._id ? appointment : appt
                          )
                        : null
                );
    
                alert('Appointment updated successfully.');
            } else {
                const error = await response.json();
                alert(`Error updating appointment: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('An unexpected error occurred while updating the appointment.');
        }
    };
        
    const handleAddAppointment = async (appointmentData: any) => {
        try {
            const response = await fetchBackendPOST('/appointment/add', appointmentData);
    
            if (response.ok) {
                const { appointment } = await response.json(); // Yanıt içindeki `appointment` nesnesini al
    
                // appointments state'ine ekle
                setAppointments((prev) =>
                    prev ? [...prev, appointment] : [appointment]
                );
    
                alert('Appointment added successfully.');
                setOpenAppointmentModal(false); 
            } else {
                const error = await response.json();
                alert(`Error adding appointment: ${error.message}`);
            }
        } catch (error) {
            console.error('Error adding appointment:', error);
            alert('An unexpected error occurred while adding the appointment.');
        }
    };

    const handleDeleteAppointment = async (appointmentId: string) => {
        try {
            const response = await fetchBackendDELETE(`/appointment/${appointmentId}`);
            if (response.ok) {
                // appointments state'inden sil
                setAppointments((prev) =>
                    prev ? prev.filter((appt) => appt._id !== appointmentId) : null
                );

                alert('Appointment deleted successfully.');
            } else {
                alert('Error deleting appointment.');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };
    // Filtrelenmiş randevular
    const filteredAppointments = useMemo(() => {
        if (!appointments) return [];
        if (selectedFilter === 'Hepsi') return appointments;
        if (selectedFilter === 'İleri Tarihli') {
            return appointments.filter((appt) => new Date(appt.date) > new Date());
        }
        return appointments.filter((appt) => appt.status === selectedFilter);
    }, [selectedFilter, appointments]);

    // Tarihi geçmiş ileri tarihli randevuları tespit et
    useEffect(() => {
        if (!appointments) return;

        const overdue = appointments.filter(
            (appt) => appt.status === 'İleri Tarihli' && new Date(appt.date) < new Date()
        );

        if (overdue.length > 0) {
            setOverdueAppointments(overdue);
            setOpenOverdueDialog(true);

            // Notes bilgilerini varsayılan olarak ayarla
            const defaultNotes: { [id: string]: string } = {};
            overdue.forEach((appt) => {
                defaultNotes[appt._id] = appt.notes || '';
            });
            setNotesToUpdate(defaultNotes);
        }
    }, [appointments]);


    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Randevular</Typography>
                <Button onClick={() => setOpenAppointmentModal(true)} variant="contained" size="small">
                    Ekle
                </Button>
            </Box>
            {/* Geçmiş ileri tarihli randevular için uyarı */}
            <Dialog open={openOverdueDialog} onClose={() => setOpenOverdueDialog(false)}>
                <DialogTitle>Tarihi Geçmiş Randevular</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bazı "İleri Tarihli" randevular geçmiş durumda. Lütfen durumlarını güncelleyin ve gerekirse not ekleyin.
                    </DialogContentText>
                    {overdueAppointments.map((appt) => (
                        <Card key={appt._id} sx={{ my: 2 }}>
                            <CardContent>
                                <Typography>
                                    Tarih ve Saat: {new Date(appt.date).toLocaleString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} - Hizmet: {appt.serviceType}
                                </Typography>
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Durum</InputLabel>
                                    <Select
                                        value={statusToUpdate}
                                        onChange={(e) => setStatusToUpdate(e.target.value)}
                                    >
                                        <MenuItem value="Gelmedi">Gelmedi</MenuItem>
                                        <MenuItem value="Geldi">Geldi</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Notlar"
                                    multiline
                                    rows={2}
                                    value={notesToUpdate[appt._id] || ''}
                                    onChange={(e) =>
                                        setNotesToUpdate((prev) => ({
                                            ...prev,
                                            [appt._id]: e.target.value,
                                        }))
                                    }
                                    sx={{ mt: 2 }}
                                />
                                <Button
                                    onClick={() => handleUpdateStatus(appt._id)}
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 1 }}
                                >
                                    Durumu Güncelle
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenOverdueDialog(false)} color="primary">
                        Kapat
                    </Button>
                </DialogActions>
            </Dialog>
            <UpdateAppointmentModal
                open={openAppointmentUpdateModal}
                onClose={() => setOpenUpdateAppointmentModal(false)}
                onSubmit={handleUpdateAppointment}
                appointment={selectedAppointment!}
            />
            <AddAppointmentModal
                open={openAppointmentModal}
                onClose={() => setOpenAppointmentModal(false)}
                onSubmit={handleAddAppointment}
                customerId={customerId as string}
                services={services}
                appointments={appointments}
            />
            <Divider sx={{ my: 2 }} />
            <ButtonGroup fullWidth sx={{ mt: 2, mb: 2 }}>
                <Button
                    variant={selectedFilter === 'İleri Tarihli' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedFilter('İleri Tarihli')}
                >
                    İleri Tarihli
                </Button>
                <Button
                    variant={selectedFilter === 'Gelmedi' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedFilter('Gelmedi')}
                >
                    Gelmedi
                </Button>
                <Button
                    variant={selectedFilter === 'Geldi' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedFilter('Geldi')}
                >
                    Geldi
                </Button>
                <Button
                    variant={selectedFilter === 'Hepsi' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedFilter('Hepsi')}
                >
                    Hepsi
                </Button>
            </ButtonGroup>
            {filteredAppointments.length > 0 ? (
                <List>
                    {filteredAppointments.map((appointment) => {


                        return (
                            <ListItem key={appointment._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                <ListItemText
                                    primary={appointment.serviceType}
                                    secondary={`Tarih ve Saat: ${new Date(
                                        appointment.date
                                    ).toLocaleString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} | Durum: ${appointment.status}`}
                                />
                                <Button
                                    sx={{ mr: 3 }}
                                    onClick={() => {
                                        setSelectedAppointment(appointment);
                                        setOpenUpdateAppointmentModal(true);
                                    }}
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    startIcon={<Icon icon="mdi:pencil" />}
                                >
                                    Düzenle
                                </Button>

                                <Button
                                    onClick={() => handleDeleteAppointment(appointment._id)}
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    startIcon={<Icon icon="mdi:delete" />}
                                >
                                    Sil
                                </Button>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <Typography color="text.secondary">Randevu bulunmamaktadır.</Typography>
            )}
        </div>
    );
};

export default CustomerAppointments;
