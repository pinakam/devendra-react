import React, {useState, useEffect } from "react";
import axios from 'axios';
import Select from 'react-select';

interface RowData {
  product: string;
  batch_no: string;
  expiry: string;
  qty:string;
}

interface TableRowsProps {
  rowsData: RowData[];
  deleteTableRows: (index: number) => void;
  handleChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const today = new Date();
const date = today.setDate(today.getDate()); 
const defaultValue = new Date(date).toISOString().split('T')[0] // yyyy-mm-dd

function TableRows({ rowsData, deleteTableRows,handleChange }: TableRowsProps) {
  const [options, setOptions] = useState<any>(null);
  
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

  useEffect(() => {
    getData()
  },[])
  return (
    <>
      {rowsData.map((data, index) => {
        const { product, batch_no, expiry,qty } = data;
        return (
          <tr key={index}>
            <td>
              <Select options={options}  />
            </td>
            <td>
              <input type="number"  onChange={(event) => handleChange(index, event)} className="form-control" placeholder="Batch No." required />
            </td>
            <td>
              <input type='date'   onChange={(event) => handleChange(index, event)} defaultValue={defaultValue} />
            </td>
            <td>
              <input type="number"  onChange={(event) => handleChange(index, event)} className="form-control" placeholder="Type here" required />
            </td>
            <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => deleteTableRows(index)}
              >
                x
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default TableRows;
