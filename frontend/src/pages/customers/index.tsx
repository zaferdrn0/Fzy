// pages/customers/index.tsx
import { Customer } from '@/models/exampleUser';
import { fetchBackendGET } from '@/utils/backendFetch';
import CustomerDashboard from '@/views/pages/customers/CustomersDashboard';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';


const CustomerList: NextPage = () => {
  const [customers,setCustomers] = useState<Customer[] | "loading">("loading")

  const getCustomers = async () =>{
    const customers = await fetchBackendGET('/customer/list');
    if(customers.ok){
      const data = await customers.json();
       setCustomers(data)
    }
  }
  useEffect(() =>{
    getCustomers()
  },[]);
  
  if(customers === "loading"){
    return <div>Loading...</div>
  }

  return (
<CustomerDashboard customers={customers}/>
  );
};

export default CustomerList;
