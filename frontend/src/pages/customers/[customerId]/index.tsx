// pages/customers/[customerId]/index.tsx

import { useRouter } from 'next/router';
import { NextPage } from 'next';
import CustomerDetail from '@/views/pages/customers/CustomerDetail';
import { fetchBackendGET } from '@/utils/backendFetch';
import { useEffect, useState } from 'react';
import { Customer, customerData } from '@/models/dataType';

const CustomerDetailPage: NextPage = () => {

  const router = useRouter();
  const { customerId } = router.query;
  const [customer, setCustomer] = useState<Customer | null>(customerData[0]);

  const getCustomerDetail = async  () =>{
    const customer = await fetchBackendGET(`/customer/${customerId}`)
    if(customer.ok){
      const data = await customer.json();
      return setCustomer(data)
    }
  }

  useEffect(()=>{ 
    if(customerId){
      getCustomerDetail()
    }
  },[customerId])

if(customer === null){
  return <div>Loading...</div>
}

  return <CustomerDetail customer={customer} />;
};

export default CustomerDetailPage;
