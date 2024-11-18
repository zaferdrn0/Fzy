import React, { useState } from 'react';
import { Customer } from '@/models/dataType';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/router';
import { fetchBackendPOST } from '@/utils/backendFetch';

const EventTab = ({ customer }: { customer: Customer }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    status: '',
    notes: '',
    service: '',
  });
  const router = useRouter();
  const customerId = router.query.customerId as string;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attended':
        return 'success';
      case 'missed':
        return 'error';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  const allEvents = customer.services.flatMap((service) =>
    service?.events?.map((event) => ({
      ...event,
      serviceType: service.serviceType,
    }))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    try {
      const response = await fetchBackendPOST(`/event/add/${customerId}`, {
        date: formData.date,
        status: formData.status,
        notes: formData.notes,
        service: formData.service,
      });
      if (!response.ok) throw new Error('Failed to add event');
      setOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Event
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
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
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                <TableCell>{event.serviceType}</TableCell>
                <TableCell>
                  <Chip label={event.status} color={getStatusColor(event.status)} size="small" />
                </TableCell>
                <TableCell>{event.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EventTab;
