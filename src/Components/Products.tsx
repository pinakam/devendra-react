import React, {useState, useEffect } from 'react'
import AsyncPaginate from "react-select-async-paginate";
import axios from 'axios';
import AddDeleteTableRows from './AddDeleteTableRows';
import Select from 'react-select';

interface optionValues {
    value:number,
    label : string
}


interface Row {
    product: string;
    batch: string;
    expiry:string,
    qty:string
  }
  
const today = new Date();
const date = today.setDate(today.getDate()); 
const defaultValue = new Date(date).toISOString().split('T')[0] // yyyy-mm-dd


const Products = () => {

    const [options, setOptions] = useState<any>([{value:0,label:'Loading...'}]);
    const [selected, setSelected] = useState<optionValues>({value:0,label:'Select'});
    const [batch,setBatch] = useState<string>('');
    const [expiry,setExpiry] = useState<string>(defaultValue);
    const [qty,setQty] = useState<string>('');
    const [rows, setRows] = useState<Row[]>([]);
    const [newRow, setNewRow] = useState<Row>({ product: '', batch: '',expiry:'',qty:'' });
  
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
            console.log(response.data)
            localStorage.setItem('token',response.data.token)
        })
        .catch(err => console.log(err))
    }

    const getData = () => {
        const token =localStorage.getItem('token')
        axios.get('https://eaf-dms-api.yecor.com/api/inventory/product-SKUs/?warehouse_id=22&ordering=name&search=&limit=100&offset=&remove_product_stocking=true',{
            headers: {
                'Authorization': `Bearer ${token}`,
              },
        })
        .then(response => {
          console.log(response.data.results);
          
          const transformed = response.data.results.map((item : any) =>(
            {
                value :item.id,
                label : item.name
            }
          ))
          setOptions(transformed)
        })
        .catch(err => console.log(err))
      }
    
    const handleChange = (selectedOption : any) => {
        setSelected(selectedOption);
        console.log(`Option selected:`, selectedOption);
      };

      const finalData = {
        "stock_entries": [
            {
                "product_id": selected.value,
                "batch_number": "#"+batch,
                "expiry_date": expiry,
                "qty":qty
            }
            ],
            "stock_type": "FreshProduct",
            "stock_entry_type": "In",
            "receiver_warehouse_id": "62" 
      }
    const handleSubmit = (e:React.SyntheticEvent) =>{
        e.preventDefault();
        console.log(finalData);
        axios.post('https://eaf-dms-api.yecor.com/api/inventory/bulk_stock_in_out/',finalData,{withCredentials:true})
        .then(response => {
            console.log(response)
            setBatch('')
            setExpiry(defaultValue)
            setQty('')
        })
        .catch(err => console.log(err))
      }

    const handleReset = () =>{
        setBatch('')
        setExpiry(defaultValue)
        setQty('')
    }

    const addRow = () => {
        setRows([...rows, { ...newRow }]);
      };
    useEffect(() => {
        login()
        getData()
    },[])

  return (
    <>
        {/* <AddDeleteTableRows /> */}

        <table className="table table-bordered table-hover table-striped">
            <thead>
                <tr>
                <th className="col-5">Product SKU</th>
                <th className="col">Batch Number</th>
                <th className="col">Expiry Date</th>
                <th className="col">Inward Qty</th>
                <th>
                  <button onClick={addRow} className="btn btn-outline-success" >
                    +
                  </button>
                </th>
                </tr>
            </thead>
            <tbody>
            <tr>
            <td>
              <Select options={options} onChange={handleChange}  />
            </td>
            <td>
             <input value={batch} type="number" onChange={(e) => setBatch(e.target.value)} className="form-control" placeholder="Batch No." required />
            </td>
            <td>
              <input type='date' value={expiry} onChange={(e) => setExpiry(e.target.value)} defaultValue={defaultValue} />
            </td>
            <td>
              <input type="number" value={qty} onChange={(e) => setQty(e.target.value)}  className="form-control" placeholder="Type here" required />
            </td>
            <td>
              <button
                className="btn btn-outline-danger"
              >
                x
              </button>
            </td>
          </tr>
            </tbody>
          </table>
          <button type='reset' value='Reset' onClick={handleReset} className="btn btn-danger">Reset </button> &nbsp;&nbsp;&nbsp;
          <button type='submit' value='Submit' onClick={handleSubmit} className="btn btn-primary">Submit </button>
    </>
  )
}

export default Products
