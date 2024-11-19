import React, { useState } from 'react';
import { Customer, Event } from '@/models/dataType';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  IconButton,
  Tooltip,

} from '@mui/material';
import { useRouter } from 'next/router';
import AddEvent from '@/components/event/AddEvent';
import { fetchBackendDELETE, fetchBackendPOST, fetchBackendPUT } from '@/utils/backendFetch';
import { Icon } from '@iconify/react/dist/iconify.js';
import UpdateEvent from '@/components/event/UpdateEvent';

const EventTab = ({ customer }: { customer: Customer }) => {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const router = useRouter();
  const customerId = router.query.customerId as string;

  const handleUpdateModalOpen = (event: Event) => {
    setSelectedEvent(event);
    setUpdateOpen(true);
  };

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
  const handleAddEventSubmit = async (data: Record<string, any>) => {
    try {
      const response = await fetchBackendPOST(`/event/add/${customerId}`, {data});
      if (!response.ok) throw new Error('Failed to add event');
    
    } catch (error) {
      console.error('Error creating event:', error);
    }
    setOpen(false)
  };

  const handleUpdateEventSubmit = async ( data: Record<string, any>) => {
    try {
      const response = await fetchBackendPUT(`/event/${selectedEvent?._id}`, data);
      if (!response.ok) throw new Error('Failed to update event');

    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
          const response = await fetchBackendDELETE(`/event/${id}`);
          if (!response.ok) throw new Error('Failed to delete event');

        } catch (error) {
          console.error('Error deleting event:', error);
        }
  }


  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Event
      </Button>
      <AddEvent customer={customer} onClose={()=>setOpen(false)} onSubmit={handleAddEventSubmit} open={open}/>
      {selectedEvent && (
      <UpdateEvent onClose={()=>setUpdateOpen(false)} onSubmit={handleUpdateEventSubmit} open={updateOpen} event={selectedEvent}/>)}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
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
                <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleUpdateModalOpen(event)}>
                      <Icon icon="mdi:pencil" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(event._id)}>
                      <Icon icon="mdi:delete" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EventTab;
