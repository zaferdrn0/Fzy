import { Customer } from '@/models/dataType';
import { Modal, Box, TextField, MenuItem, Button } from '@mui/material'
import React, { useState } from 'react'

interface AddEventModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, any>) => void;
    customer:Customer
  }
const AddEvent : React.FC<AddEventModalProps> = ({ open, onClose, onSubmit,customer }) => {
    const [formData, setFormData] = useState({
        date: '',
        status: '',
        notes: '',
        service: '',
      });

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            date: '',
            status: '',
            notes: '',
            service: '',
        });
        onClose();
      };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
      
        boxShadow: 24,
        p: 4,
      }}
    >
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
      <TextField
          name="service"
          select
          label="Service"
          fullWidth
          margin="normal"
          value={formData.service}
          onChange={handleInputChange}
        >
          {customer.services.map((service) => (
            <MenuItem key={service.serviceType} value={service.serviceType}>
              {service.serviceType}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="date"
          type="datetime-local"
          label="Date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          onChange={handleInputChange}
        />
        <TextField
          name="status"
          select
          label="Status"
          fullWidth
          margin="normal"
          value={formData.status}
          onChange={handleInputChange}
        >
          <MenuItem value="attended">Attended</MenuItem>
          <MenuItem value="missed">Missed</MenuItem>
          <MenuItem value="scheduled">Scheduled</MenuItem>
        </TextField>
        <TextField
          name="notes"
          label="Notes"
          fullWidth
          margin="normal"
          value={formData.notes}
          onChange={handleInputChange}
        />
  
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  </Modal>
  )
}

export default AddEvent