import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress
} from '@mui/material';
import { Appointment, Service, Subscription } from '@/models/dataType';
import { isSubscriptionValid } from '@/utils/customers/isValidSubscription';
import { fetchBackendGET } from '@/utils/backendFetch';

interface AddAppointmentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (appointmentData: {
        customerId: string;
        serviceId: string;
        subscriptionId?: string | null;
        date: string;
        notes?: string;
        fee: number;
        isPaid: boolean;
        status: string;
        doctorReport?: {
            diagnosis?: string;
            injuryType?: string;
            notes?: string;
        };
        massageDetails?: {
            massageType?: string;
            notes?: string;
        };
    }) => void;
    customerId: string;
    services: Service[] | null;
    appointments: Appointment[] | null;
}

type FormData = {
    date: string;
    notes: string;
    fee: number;
    isPaid: boolean;
    doctorReport: {
        diagnosis: string;
        injuryType: string;
        notes: string;
    };
    massageDetails: {
        massageType: string;
        notes: string;
    };
};

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
    open,
    onClose,
    onSubmit,
    customerId,
    services,
    appointments,
}) => {
    const [selectedService, setSelectedService] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        date: '',
        notes: '',
        fee: 0,
        isPaid: false,
        doctorReport: {
            diagnosis: '',
            injuryType: '',
            notes: '',
        },
        massageDetails: {
            massageType: '',
            notes: '',
        },
    });
    const [status, setStatus] = useState<string>('İleri Tarihli');
    const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState<boolean>(false);

    // Subscriptions'ı dinamik olarak çek
    useEffect(() => {
        if (open) {
            const fetchSubscriptions = async () => {
                setLoadingSubscriptions(true);
                try {
                    const response = await fetchBackendGET(`/subscription/${customerId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setSubscriptions(data);
                    } else {
                        setSubscriptions(null);
                    }
                } catch (error) {
                    console.error('Error fetching subscriptions:', error);
                    setSubscriptions(null);
                } finally {
                    setLoadingSubscriptions(false);
                }
            };

            fetchSubscriptions();
        }
    }, [open, customerId]);

    // Seçilen hizmete göre geçerli abonelikleri filtrele
    useEffect(() => {
        if (selectedService && subscriptions) {
            const serviceId = services?.find((service) => service.type === selectedService)?._id;

            if (serviceId) {
                const validSubscriptions = subscriptions.filter((sub) => {
                    if (sub.serviceId !== serviceId) return false;

                    // Abonelik geçerlilik kontrolü
                    if (!isSubscriptionValid(sub)) return false;

                    const relatedAppointments = appointments?.filter(
                        (appt) => appt.subscriptionId === sub._id
                    );

                    const attendedCount = relatedAppointments?.filter(
                        (appt) => appt.status === 'Geldi'
                    ).length || 0;

                    const upcomingCount = relatedAppointments?.filter(
                        (appt) => appt.status === 'İleri Tarihli'
                    ).length || 0;

                    const missedCount = relatedAppointments?.filter(
                        (appt) => appt.status === 'Gelmedi'
                    ).length || 0;

                    const totalAllowed = sub.sessionLimit + sub.makeupSessions;
                    const totalScheduled = attendedCount + upcomingCount + missedCount;

                    return totalScheduled < totalAllowed;
                });

                setFilteredSubscriptions(validSubscriptions);
            }
        } else {
            setFilteredSubscriptions([]);
        }
    }, [selectedService, subscriptions, services, appointments]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        if (name.includes('.')) {
            const [group, field] = name.split('.');
    
            // Dinamik olarak grubu kontrol eder ve güncelleriz
            if (group in formData && typeof formData[group as keyof FormData] === 'object') {
                setFormData((prev) => ({
                    ...prev,
                    [group]: {
                        ...(prev[group as keyof FormData] as Record<string, any>),
                        [field]: value,
                    },
                }));
            }
        } else {
            // Grup yoksa doğrudan değer güncellenir
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();

        if (status === 'İleri Tarihli' && selectedDate < currentDate) {
            alert('İleri Tarihli bir randevu için geçmiş tarih seçemezsiniz.');
            return;
        }
        if ((status === 'Geldi' || status === 'Gelmedi') && selectedDate > currentDate) {
            alert(`${status} durumunda ileri tarihli bir randevu seçemezsiniz.`);
            return;
        }

        setFormData((prev) => ({ ...prev, date: e.target.value }));
    };

    const handleSubmit = () => {
        const selectedServiceId = services?.find((service) => service.type === selectedService)?._id;

        if (!selectedServiceId) {
            alert('Lütfen bir hizmet seçin.');
            return;
        }

        if (!formData.date) {
            alert('Lütfen bir tarih seçin.');
            return;
        }

        if (
            selectedSubscription &&
            !filteredSubscriptions.some((sub) => sub._id === selectedSubscription)
        ) {
            alert('Seçtiğiniz abonelik, mevcut limitleri aşıyor.');
            return;
        }

        onSubmit({
            customerId,
            serviceId: selectedServiceId,
            subscriptionId: selectedSubscription || null,
            date: formData.date,
            notes: formData.notes,
            fee: formData.fee,
            isPaid: formData.isPaid,
            status,
            doctorReport: selectedService === 'Fizyoterapi' ? formData.doctorReport : undefined,
            massageDetails: selectedService === 'Masaj' ? formData.massageDetails : undefined,
        });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
                <Typography variant="h6" gutterBottom>Randevu Ekle</Typography>
                {loadingSubscriptions ? (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <CircularProgress />
                        <Typography>Abonelikler yükleniyor...</Typography>
                    </Box>
                ) : (
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Hizmet</InputLabel>
                            <Select
                                value={selectedService}
                                onChange={(e) => {
                                    setSelectedService(e.target.value);
                                    setSelectedSubscription(null);
                                    setFormData({
                                        ...formData,
                                        doctorReport: { diagnosis: '', injuryType: '', notes: '' },
                                        massageDetails: { massageType: '', notes: '' },
                                    });
                                }}
                            >
                                {services?.map((service) => (
                                    <MenuItem key={service._id} value={service.type}>
                                        {service.type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedService && (
                            <>
                                {filteredSubscriptions.length > 0 && (
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Abonelik</InputLabel>
                                        <Select
                                            value={selectedSubscription || ''}
                                            onChange={(e) => setSelectedSubscription(e.target.value)}
                                        >
                                            <MenuItem value="">Abonelik Yok</MenuItem>
                                            {filteredSubscriptions.map((sub) => (
                                                <MenuItem key={sub._id} value={sub._id}>
                                                    {sub._id} - Başlangıç: {new Date(sub.startDate).toLocaleDateString()}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Durum</InputLabel>
                                    <Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <MenuItem value="İleri Tarihli">İleri Tarihli</MenuItem>
                                        <MenuItem value="Geldi">Geldi</MenuItem>
                                        <MenuItem value="Gelmedi">Gelmedi</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Ücret"
                                    name="fee"
                                    type="number"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Notlar"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    sx={{ mb: 2 }}
                                />
                                {selectedService === 'Fizyoterapi' && (
                                    <>
                                        <Typography variant="subtitle1" gutterBottom>Doktor Raporu</Typography>
                                        <TextField
                                            fullWidth
                                            label="Teşhis"
                                            name="doctorReport.diagnosis"
                                            value={formData.doctorReport.diagnosis}
                                            onChange={handleChange}
                                            sx={{ mb: 2 }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Yaralanma Türü"
                                            name="doctorReport.injuryType"
                                            value={formData.doctorReport.injuryType}
                                            onChange={handleChange}
                                            sx={{ mb: 2 }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Doktor Notları"
                                            name="doctorReport.notes"
                                            value={formData.doctorReport.notes}
                                            onChange={handleChange}
                                            sx={{ mb: 2 }}
                                        />
                                    </>
                                )}
                                {selectedService === 'Masaj' && (
                                    <>
                                        <Typography variant="subtitle1" gutterBottom>Masaj Detayları</Typography>
                                        <TextField
                                            fullWidth
                                            label="Masaj Türü"
                                            name="massageDetails.massageType"
                                            value={formData.massageDetails.massageType}
                                            onChange={handleChange}
                                            sx={{ mb: 2 }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Masaj Notları"
                                            name="massageDetails.notes"
                                            value={formData.massageDetails.notes}
                                            onChange={handleChange}
                                            sx={{ mb: 2 }}
                                        />
                                    </>
                                )}
                            </>
                        )}
                        <Button fullWidth variant="contained" onClick={handleSubmit}>
                            Ekle
                        </Button>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default AddAppointmentModal;
