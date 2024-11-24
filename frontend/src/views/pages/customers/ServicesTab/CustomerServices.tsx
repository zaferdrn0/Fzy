import React, { useEffect, useState } from 'react';
import { Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import { fetchBackendGET } from '@/utils/backendFetch';
import { useRouter } from 'next/router';
import { Service } from '@/models/dataType';

const CustomerServices = ( ) => {
  const router = useRouter()
  const { customerId } = router.query;
  const [services,setServices] = useState<Service[] | null>(null)

  const getServices = async ( ) => { 
    const response = await fetchBackendGET(`/service/${customerId}`)
    if(response.ok){
          const data = await response.json();
          return setServices(data)
        }
        return setServices(null);
  }
  useEffect(() => {
    getServices();
  },[]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Hizmetler
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List>
        {services?.map((service) => (
          <ListItem key={service._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <ListItemText primary={service.type} secondary={service.description} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CustomerServices;
