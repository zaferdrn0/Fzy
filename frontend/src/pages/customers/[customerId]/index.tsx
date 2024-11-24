// pages/customers/[customerId]/index.tsx

import { useRouter } from 'next/router';
import { NextPage } from 'next';
import CustomerDetail from '@/views/pages/customers/CustomerDetail';
import { fetchBackendGET } from '@/utils/backendFetch';
import { useEffect, useState } from 'react';
import { Customer } from '@/models/dataType';

const CustomerDetailPage: NextPage = () => {

  const router = useRouter();
  const { customerId } = router.query;
  const [customer, setCustomer] = useState<Customer | null>(null);

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

  return <CustomerDetail customer={customer} setCustomer={setCustomer}/>;
};

export default CustomerDetailPage;
