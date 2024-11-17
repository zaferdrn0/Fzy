import AddServiceModal from '@/components/service/addService';
import { Customer } from '@/models/dataType';
import { fetchBackendPOST } from '@/utils/backendFetch';
import { getMembershipStatus } from '@/utils/isMembershipActive';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Box, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

const Service = ( {customer}:{customer:Customer}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    const { customerId } = router.query; 
  
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);
  
    const handleSubmit = async (data: Record<string, any>) => {
      try {
        const response = await fetchBackendPOST(`/service/add/${customerId}`, data)
        if (response.ok) {
          console.log('Service added successfully');
        } else {
          console.error('Failed to add service');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      handleClose();
    };

    return (
        <Box>
            <Box>
                <AddServiceModal
                    open={modalOpen}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                />
                <Button onClick={handleOpen}>Add New Service</Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Service Type</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Total Fee</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Days Left</TableCell> {/* Yeni sütun eklendi */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customer.services.map((service) => {

                            const { isActive, daysLeft } = getMembershipStatus(
                                service.membershipStartDate || '',
                                service.membershipDuration
                            );
                            return (
                                <TableRow key={service._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Icon
                                                icon={
                                                    service.serviceType === 'pilates'
                                                        ? 'mdi:yoga'
                                                        : service.serviceType === 'massage'
                                                            ? 'mdi:hand-heart'
                                                            : 'mdi:doctor'
                                                }
                                                width={24}
                                                height={24}
                                            />
                                            <Typography sx={{ ml: 1 }}>
                                                {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {service.membershipType && `Membership: ${service.membershipType}`}
                                        {service.massageType && `Type: ${service.massageType}`}
                                        {service.injuryType && `Injury: ${service.injuryType}`}
                                    </TableCell>
                                    <TableCell>{service.totalFee} TL</TableCell>
                                    <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {service.membershipStartDate ? isActive ? `${daysLeft} days left` : 'Expired' : 0}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Service