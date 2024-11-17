import { Dispatch, SetStateAction } from "react";
import { fetchBackendGET } from "../backendFetch";
import { Customer } from "@/models/dataType";

export const getCustomers = async (setCustomers:Dispatch<SetStateAction<Customer[] | "loading">>) =>{
    const customers = await fetchBackendGET('/customer/list');
    if(customers.ok){
      const data = await customers.json();
       setCustomers(data)
    }
  }