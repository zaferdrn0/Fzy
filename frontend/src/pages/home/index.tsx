import RegisterForm from '@/views/pages/home/AddCustomer'
import ListCustomers from '@/views/pages/home/ListCustomer'
import { Box, Typography } from '@mui/material'
import React from 'react'

const Home = () => {
  return (
    <Box>
      <Typography variant='h2' >Home Page</Typography>
      <Typography>Welcome to the Fzy website!</Typography>
      <RegisterForm/>
      <Typography>Customers</Typography>
      <ListCustomers/>
    </Box>
  )
}

export default Home