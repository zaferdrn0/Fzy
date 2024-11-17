import { Customer } from '@/models/dataType'
import { calculateAge } from '@/utils/calculateAge'
import { Grid, Card, Box, Avatar, Typography, List, ListItem, ListItemText, Button } from '@mui/material'
import React from 'react'

const UserInfoCard = ({customer}:{customer:Customer}) => {
  return (
    <Grid item xs={12} md={3}>
    <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
                sx={{ width: 120, height: 120, mb: 2 }}
                src="/default-avatar.png"
            />
            <Typography variant="h5">{`${customer.name.first} ${customer.name.last}`}</Typography>
            <Typography
                variant="body2"
                sx={{
                    bgcolor: 'error.light',
                    color: 'error.contrastText',
                    px: 1,
                    borderRadius: 1,
                    mt: 1
                }}
            >
                Subscriber
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{customer.services.length}</Typography>
                <Typography variant="body2" color="textSecondary">Services</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                    {customer.services.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">Total Events</Typography>
            </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>Details</Typography>
        <List dense>
            <ListItem>
                <ListItemText
                    primary="Email"
                    secondary={customer.email}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Phone"
                    secondary={customer.phone}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Age"
                    secondary={calculateAge(customer.birthDate)}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Weight"
                    secondary={`${customer.weight} kg`}
                />
            </ListItem>
        </List>

        <Box sx={{ mt: 2 }}>
            <Button
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
            >
                Edit
            </Button>
            <Button
                variant="outlined"
                color="error"
                fullWidth
            >
                Suspend
            </Button>
        </Box>
    </Card>
</Grid>
  )
}

export default UserInfoCard