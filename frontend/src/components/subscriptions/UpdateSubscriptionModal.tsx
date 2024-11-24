import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { Subscription } from '@/models/dataType';

interface UpdateSubscriptionModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        subscriptionId: string;
        durationDays?: number;
        startDate?: string;
        sessionLimit?: number;
        fee?: number;
        makeupSessions?: number; // Telafi ders sayısı
    }) => void;
    subscription: Subscription | null;
}

const UpdateSubscriptionModal: React.FC<UpdateSubscriptionModalProps> = ({
    open,
    onClose,
    onSubmit,
    subscription,
}) => {
    const [formData, setFormData] = useState({
        durationDays: 0,
        startDate: '',
        sessionLimit: 0,
        fee: 0,
        makeupSessions: 0, // Telafi ders sayısı
    });

    const [errors, setErrors] = useState({
        durationDays: '',
        startDate: '',
        sessionLimit: '',
        fee: '',
        makeupSessions: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'fee' || name === 'sessionLimit' || name === 'durationDays' || name === 'makeupSessions'
                ? Number(value)
                : value,
        }));

        // Hata kontrolü
        setErrors((prev) => ({
            ...prev,
            [name]: value === '' ? `${name} alanı boş bırakılamaz.` : '',
        }));
    };

    const handleSubmit = () => {
        const newErrors: any = {};
        if (!formData.durationDays) newErrors.durationDays = 'Süre (Gün) boş bırakılamaz.';
        if (!formData.startDate) newErrors.startDate = 'Başlangıç tarihi boş bırakılamaz.';
        if (!formData.sessionLimit) newErrors.sessionLimit = 'Oturum limiti boş bırakılamaz.';
        if (!formData.fee) newErrors.fee = 'Ücret boş bırakılamaz.';
        if (formData.makeupSessions < 0) newErrors.makeupSessions = 'Telafi ders sayısı negatif olamaz.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({ subscriptionId: subscription!._id, ...formData });
        onClose();
    };

    useEffect(() => {
        if (subscription === null) return;
        setFormData({
            durationDays: subscription.durationDays,
            startDate: subscription.startDate,
            sessionLimit: subscription.sessionLimit,
            fee: subscription.fee,
            makeupSessions: subscription.makeupSessions || 0,
        });
    }, [subscription]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
                <Typography variant="h6" gutterBottom>Abonelik Güncelle</Typography>
                <TextField
                    fullWidth
                    label="Süre (Gün)"
                    name="durationDays"
                    type="number"
                    value={formData.durationDays}
                    onChange={handleChange}
                    error={!!errors.durationDays}
                    helperText={errors.durationDays}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Başlangıç Tarihi"
                    name="startDate"
                    type="date"
                    value={formData.startDate.split('T')[0]}
                    onChange={handleChange}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Oturum Limiti"
                    name="sessionLimit"
                    type="number"
                    value={formData.sessionLimit}
                    onChange={handleChange}
                    error={!!errors.sessionLimit}
                    helperText={errors.sessionLimit}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Ücret"
                    name="fee"
                    type="number"
                    value={formData.fee}
                    onChange={handleChange}
                    error={!!errors.fee}
                    helperText={errors.fee}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Telafi Ders Sayısı"
                    name="makeupSessions"
                    type="number"
                    value={formData.makeupSessions}
                    onChange={handleChange}
                    error={!!errors.makeupSessions}
                    helperText={errors.makeupSessions}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 2 }}>
                        İptal
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Güncelle
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default UpdateSubscriptionModal;
