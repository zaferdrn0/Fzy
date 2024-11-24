import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { Appointment } from '@/models/dataType';

interface UpdateAppointmentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
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
    }) => void;
    appointment: Appointment | null;
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

const UpdateAppointmentModal: React.FC<UpdateAppointmentModalProps> = ({
    open,
    onClose,
    onSubmit,
    appointment,
}) => {
    const [formData, setFormData] = useState<FormData>({
        date: '',
        notes: '',
        fee: 0,
        isPaid: false,
        doctorReport: { diagnosis: '', injuryType: '', notes: '' },
        massageDetails: { massageType: '', notes: '' },
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                date: appointment.date ? new Date(appointment.date).toISOString().slice(0, 16) : '', // YYYY-MM-DDTHH:mm
                notes: appointment.notes || '',
                fee: appointment.fee || 0,
                isPaid: appointment.isPaid || false,
                doctorReport: {
                    diagnosis: appointment.doctorReport?.diagnosis || '',
                    injuryType: appointment.doctorReport?.injuryType || '',
                    notes: appointment.doctorReport?.notes || '',
                },
                massageDetails: {
                    massageType: appointment.massageDetails?.massageType || '',
                    notes: appointment.massageDetails?.notes || '',
                },
            });
        }
    }, [appointment]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        if (name.startsWith('doctorReport.') || name.startsWith('massageDetails.')) {
            const [group, field] = name.split('.');
    
            if (group === 'doctorReport') {
                setFormData((prev) => ({
                    ...prev,
                    doctorReport: {
                        ...prev.doctorReport,
                        [field]: value,
                    },
                }));
            } else if (group === 'massageDetails') {
                setFormData((prev) => ({
                    ...prev,
                    massageDetails: {
                        ...prev.massageDetails,
                        [field]: value,
                    },
                }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    

const handleSubmit = () => {
    if (appointment) {
        const payload: any = {
            appointmentId: appointment._id,
            date: formData.date,
            notes: formData.notes,
            fee: formData.fee,
            isPaid: formData.isPaid,
        };

        if (
            formData.doctorReport &&
            (formData.doctorReport.diagnosis || formData.doctorReport.injuryType || formData.doctorReport.notes)
        ) {
            payload.doctorReport = formData.doctorReport;
        }

        // massageDetails sadece herhangi bir alanı doluysa eklenir
        if (
            formData.massageDetails &&
            (formData.massageDetails.massageType || formData.massageDetails.notes)
        ) {
            payload.massageDetails = formData.massageDetails;
        }

        onSubmit(payload);
        onClose();
    }
};
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
                <Typography variant="h6" gutterBottom>Randevu Güncelle</Typography>
                <TextField
                    fullWidth
                    label="Tarih"
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
                {appointment?.doctorReport && (
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
                {appointment?.massageDetails && (
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
                <Button fullWidth variant="contained" onClick={handleSubmit}>
                    Güncelle
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateAppointmentModal;
