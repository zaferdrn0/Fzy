import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { Service } from '@/models/dataType';

interface AddSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    customerId: string;
    serviceId: string;
    durationDays: number;
    startDate: string;
    sessionLimit: number;
    makeupSessions: number; // Telafi ders sayısı
    fee: number;
  }) => void;
  services: Service[] | null; // Available services to select
  customerId: string;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ open, onClose, onSubmit, services, customerId }) => {
  const [formData, setFormData] = useState({
    serviceId: '',
    durationDays: 30,
    startDate: '',
    sessionLimit: 10,
    makeupSessions: 0, // Telafi ders sayısı
    fee: 100,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { serviceId, durationDays, startDate, sessionLimit, makeupSessions, fee } = formData;

    // Form verilerini onSubmit'e gönder
    onSubmit({
      customerId,
      serviceId,
      durationDays: Number(durationDays),
      startDate,
      sessionLimit: Number(sessionLimit),
      makeupSessions: Number(makeupSessions), // Telafi ders sayısını gönder
      fee: Number(fee),
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
        <Typography variant="h6" gutterBottom>
          Add Subscription
        </Typography>
        <Box>
          <TextField
            select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            fullWidth
            SelectProps={{
              native: true,
            }}
            sx={{ mb: 2 }}
          >
            <option value="">Select Service</option>
            {services?.map((service) => (
              <option key={service._id} value={service._id}>
                {service.type}
              </option>
            ))}
          </TextField>
          <TextField
            label="Duration Days"
            name="durationDays"
            type="number"
            value={formData.durationDays}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Session Limit"
            name="sessionLimit"
            type="number"
            value={formData.sessionLimit}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Makeup Sessions" // Telafi ders sayısı
            name="makeupSessions"
            type="number"
            value={formData.makeupSessions}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Fee"
            name="fee"
            type="number"
            value={formData.fee}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddSubscriptionModal;
