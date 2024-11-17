import { Customer } from '@/models/dataType';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material'
import React from 'react'

const EventTab = ({customer}:{customer:Customer}) => {

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

  return (
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
            {customer.services.map((event) => (
                <TableRow key={event._id}>
                    <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                    <TableCell>{event.serviceType}</TableCell>

                    <TableCell>
                        <Chip
                            label={event.status}
                            color={getStatusColor(event.status)}
                            size="small"
                        />
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
</TableContainer>
  )
}

export default EventTab