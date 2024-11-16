// pages/customers/[customerId]/index.tsx

import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import { customers } from '@/models/exampleUser';
import CustomerDetail from '@/views/pages/customers/CustomerDetail';

const CustomerDetailPage: NextPage = () => {

  const router = useRouter();
  const { customerId } = router.query;

  const customer = customers.find(c => c._id === customerId);

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return <CustomerDetail customer={customer} />;
};

export default CustomerDetailPage;
