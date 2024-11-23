// pages/customers/index.tsx
import { Customer, customerData } from '@/models/dataType';
import { getCustomers } from '@/utils/customers/getCustomers';
import CustomerDashboard from '@/views/pages/customers/CustomersDashboard';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';


const CustomerList: NextPage = () => {
  const [customers,setCustomers] = useState<Customer[] | "loading">(customerData)

  useEffect(() =>{
    getCustomers(setCustomers)
  },[]);
  
  if(customers === "loading"){
    return <div>Loading...</div>
  }

  return (
<CustomerDashboard customers={customers} setCustomers = {setCustomers}/>
  );
};

export default CustomerList;
