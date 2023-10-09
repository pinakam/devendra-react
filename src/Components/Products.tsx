import React, { useEffect } from 'react'
import axios from 'axios';
import ProductRows from './ProductRows';

const Products = () => {
  
    const loginData = {
        "email": "yagnikoo@yopmail.com",
        "password": "Moweb@123 ",
        "device_id": "sDUhIoUzN41Is4iM1r0BcsDP4exWLpInVxuT50Ft",
        "device_token": "cyKtfAZpI9GBrLUfz8SgWV:APA91bEECZrhEE80WnlJmEOiX6_EJ-JtDF9IV5eW96wgj-ghSJ7c3K5ZG9Psh8CMyYWcoDxDcfU805SDRpBdoJompANG3YTp0aeR4wlT5tiWZdmK-3KPq7kECF8raRLRfh0qW3TN1SnA",
        "device_type": "web"
    }
    
    const login = () => {
        axios.post('https://eaf-dms-api.yecor.com/api/auth/login',loginData)
        .then(response => {
            localStorage.setItem('token',response.data.token)
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        login()
    },[])

  return (
    <>
       <ProductRows /> 
    </>
  )
}

export default Products
