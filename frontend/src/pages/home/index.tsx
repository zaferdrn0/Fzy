import { customers } from '@/models/exampleUser'
import RegisterForm from '@/views/pages/home/AddCustomer'
import ListCustomers from '@/views/pages/home/ListCustomer'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const Home = () => {

  return (
    <div>
      <h1>Hoş Geldiniz</h1>
      <Link href="/customers">
        <button>Müşteri Listesine Git</button>
      </Link>
    </div>
  );
};

export default Home