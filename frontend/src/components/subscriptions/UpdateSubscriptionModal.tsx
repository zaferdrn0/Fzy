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
    }) => void;
    subscription: Subscription | null
}

const UpdateSubscriptionModal: React.FC<UpdateSubscriptionModalProps> = ({
    open,
    onClose,
    onSubmit,
    subscription,
}) => {
    const [formData, setFormData] = useState({
        durationDays:0,
        startDate: "",
        sessionLimit: 0,
        fee: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'fee' || name === 'sessionLimit' || name === 'durationDays' ? Number(value) : value,
        }));
    };
    const handleSubmit = () => {
        onSubmit({ subscriptionId: subscription!._id, ...formData });
        onClose();
    };
    

    useEffect(()=>{
        if(subscription ===null)return 
        setFormData({
            durationDays: subscription.durationDays,
            startDate: subscription.startDate,
            sessionLimit: subscription.sessionLimit,
            fee: subscription.fee,
        }
        )
    },[subscription])

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
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Başlangıç Tarihi"
                    name="startDate"
                    type="date"
                    value={formData.startDate.split('T')[0]}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Oturum Limiti"
                    name="sessionLimit"
                    type="number"
                    value={formData.sessionLimit}
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
                <Button fullWidth variant="contained" onClick={handleSubmit}>
                    Güncelle
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateSubscriptionModal;
