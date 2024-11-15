import React, { useState, useEffect } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';
import { useRouter } from 'next/router'; // Next.js Router
import { fetchBackendGET } from '@/utils/backendFetch'; // API çağrılarını yapacak bir yardımcı fonksiyon

interface ICustomer {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  age: number;
  weight: number;
  type: string[];
}

const ListCustomers = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Next.js Router kullanımı

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetchBackendGET('/customer/list'); // GET isteği
        if (response.ok) {
          const data = await response.json();
          setCustomers(data.customers);
        } else {
          setError('Failed to fetch customers');
        }
      } catch (error) {
        setError('Error fetching customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleUpdate = (id: string) => {
    // Güncelleme sayfasına yönlendirme
    router.push(`/update-customer/${id}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Customer List</Typography>
        <List>
          {customers.map((customer) => (
            <ListItem key={customer._id}>
              <ListItemText
                primary={`${customer.name.first} ${customer.name.last}`}
                secondary={`Email: ${customer.email}, Phone: ${customer.phone}, Age: ${customer.age}, Weight: ${customer.weight}, Types: ${customer.type.join(', ')}`}
              />
              <Button onClick={() => handleUpdate(customer._id)} variant="contained" color="primary">
                Update
              </Button>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default ListCustomers;
