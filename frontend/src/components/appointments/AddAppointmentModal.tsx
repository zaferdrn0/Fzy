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
    Grid
} from '@mui/material';

import { fetchBackendPOST, fetchBackendGET } from '@/utils/backendFetch';
import { Service, Appointment } from '@/models/dataType';

interface AddAppointmentModalProps {
    open: boolean; // Modalın açık veya kapalı olduğunu belirten boolean
    onClose: () => void; // Modalın kapanması için bir callback
    onSubmit: (appointmentData: {
        customerId: string;
        serviceId: string;
        date: string;
        notes?: string;
        fee: number;
        isPaid: boolean;
        doctorReport?: {
            diagnosis?: string;
            injuryType?: string;
            notes?: string;
        };
        massageDetails?: {
            massageType?: string;
            notes?: string;
        };
    }) => void; // Randevuyu eklemek için bir callback fonksiyon
    customerId: string; // Müşteri kimliği
    services: Service[] | null; // Hizmetler dizisi veya null

    
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
    [key: string]: any; // Dinamik anahtarlar için
};

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ open, onClose, onSubmit, customerId, services }) => {
    const [selectedService, setSelectedService] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        date: '',
        notes: '',
        fee: 100,
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

    const [previousReport, setPreviousReport] = useState<any>(null);
    useEffect(() => {
        if (selectedService) {
            const selectedServiceId = services?.find(service => service.type === selectedService)?._id;
    
            if (selectedServiceId) {
                (async () => {
                    try {
                        const response = await fetchBackendGET(`/appointment/previous?customerId=${customerId}&serviceId=${selectedServiceId}`);
                        if (response.ok) {
                            const data = await response.json();
                            setPreviousReport(data?.lastAppointment || null);
                        }
                    } catch (error) {
                        console.error('Error fetching previous report:', error);
                    }
                })();
            }
        }
    }, [selectedService, customerId, services]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        if (name.includes('.')) {
            const [group, field] = name.split('.') as [keyof typeof formData, string];
            setFormData((prev) => ({
                ...prev,
                [group]: {
                    ...prev[group as keyof typeof formData],
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    const handleSubmit = () => {
        const selectedServiceId = services?.find(service => service.type === selectedService)?._id;
    
        if (!selectedServiceId) {
            alert('Hizmet seçimi geçersiz. Lütfen bir hizmet seçin.');
            return;
        }
    
        // Form verilerini parent'a gönder
        onSubmit({
            customerId,
            serviceId: selectedServiceId,
            date: formData.date,
            notes: formData.notes,
            fee: formData.fee,
            isPaid: formData.isPaid,
            doctorReport: selectedService === 'Fizyoterapi' ? formData.doctorReport : undefined,
            massageDetails: selectedService === 'Masaj' ? formData.massageDetails : undefined,
        });
    };
    

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
                <Typography variant="h6" gutterBottom>Randevu Ekle</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Hizmet</InputLabel>
                    <Select
                        value={selectedService}
                        onChange={(e) => (setSelectedService(e.target.value))}
                        fullWidth
                    >
                        {services?.map((service) => (
                            <MenuItem key={service._id} value={service.type}>
                                {service.type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
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
                            value={formData.doctorReport.diagnosis || previousReport?.doctorReport?.diagnosis || ''}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Yaralanma Türü"
                            name="doctorReport.injuryType"
                            value={formData.doctorReport.injuryType || previousReport?.doctorReport?.injuryType || ''}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Doktor Notları"
                            name="doctorReport.notes"
                            value={formData.doctorReport.notes || previousReport?.doctorReport?.notes || ''}
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
                            value={formData.massageDetails.massageType || previousReport?.massageDetails?.massageType || ''}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Masaj Notları"
                            name="massageDetails.notes"
                            value={formData.massageDetails.notes || previousReport?.massageDetails?.notes || ''}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                    </>
                )}
                <Button fullWidth variant="contained" onClick={handleSubmit}>
                    Ekle
                </Button>
            </Box>
        </Modal>
    );
};

export default AddAppointmentModal;
