import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Grid, Typography, CircularProgress } from '@mui/material';
import { fetchBackendGET, fetchBackendPUT } from '@/utils/backendFetch'; 

const UpdateCustomer = () => {
  const router = useRouter();
  const { id } = router.query; 
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCustomerData = async () => {
        try {
          const response = await fetchBackendGET(`/customer/details/${id}`);
          if (response.ok) {
            const data = await response.json();
            setCustomer(data.customer);
          } else {
            setError('Failed to fetch customer data');
          }
        } catch (error) {
          setError('Error fetching customer data');
        } finally {
          setLoading(false);
        }
      };

      fetchCustomerData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetchBackendPUT(`/customer/update/${id}`, customer);
      if (response.ok) {
        router.push('/customer/list'); 
      } else {
        setError('Failed to update customer');
      }
    } catch (error) {
      setError('Error updating customer');
    }
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
        <Typography variant="h4">Update Customer</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            value={customer?.name.first || ''}
            onChange={(e) => setCustomer({ ...customer, name: { ...customer.name, first: e.target.value } })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={customer?.name.last || ''}
            onChange={(e) => setCustomer({ ...customer, name: { ...customer.name, last: e.target.value } })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={customer?.email || ''}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            value={customer?.phone || ''}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            type="number"
            value={customer?.age || ''}
            onChange={(e) => setCustomer({ ...customer, age: Number(e.target.value) })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Weight"
            type="number"
            value={customer?.weight || ''}
            onChange={(e) => setCustomer({ ...customer, weight: Number(e.target.value) })}
            fullWidth
            margin="normal"
          />

       
          {customer?.type.includes('physiotherapist') && (
            <>
              <Typography variant="h6">Physiotherapist Details</Typography>
              <TextField
                label="Medical History"
                value={customer?.details.physiotherapist?.medicalHistory || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    physiotherapist: { 
                      ...customer.details.physiotherapist, 
                      medicalHistory: e.target.value 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Injury Type"
                value={customer?.details.physiotherapist?.injuryType || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    physiotherapist: { 
                      ...customer.details.physiotherapist, 
                      injuryType: e.target.value 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Doctor Notes"
                value={customer?.details.physiotherapist?.doctorNotes || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    physiotherapist: { 
                      ...customer.details.physiotherapist, 
                      doctorNotes: e.target.value 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Sessions Attended"
                type="number"
                value={customer?.details.physiotherapist?.sessionsAttended || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    physiotherapist: { 
                      ...customer.details.physiotherapist, 
                      sessionsAttended: Number(e.target.value) 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Total Fee"
                type="number"
                value={customer?.details.physiotherapist?.totalFee || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    physiotherapist: { 
                      ...customer.details.physiotherapist, 
                      totalFee: Number(e.target.value) 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
            </>
          )}

          {customer?.type.includes('pilates') && (
            <>
              <Typography variant="h6">Pilates Details</Typography>
              <TextField
                label="Membership Type"
                value={customer?.details.pilates?.membershipType || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    pilates: { 
                      ...customer.details.pilates, 
                      membershipType: e.target.value 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Classes Attended"
                type="number"
                value={customer?.details.pilates?.classesAttended || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    pilates: { 
                      ...customer.details.pilates, 
                      classesAttended: Number(e.target.value) 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Trainer Notes"
                value={customer?.details.pilates?.trainerNotes || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    pilates: { 
                      ...customer.details.pilates, 
                      trainerNotes: e.target.value 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Total Fee"
                type="number"
                value={customer?.details.pilates?.totalFee || ''}
                onChange={(e) => setCustomer({ 
                  ...customer, 
                  details: { 
                    ...customer.details, 
                    pilates: { 
                      ...customer.details.pilates, 
                      totalFee: Number(e.target.value) 
                    } 
                  } 
                })}
                fullWidth
                margin="normal"
              />
            </>
          )}

          <Button type="submit" variant="contained" color="primary">Update</Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default UpdateCustomer;
