import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import axios from 'axios';
import {  toast } from 'react-toastify';

type RowData = {
  product_id: { value: string; label: string } | null;
  batch_number: string;
  expiry_date: string | null;
  qty: string;
};

type TableRowsProps = {
  rowsData: RowData[];
  deleteTableRows: (index: number) => void;
  handleChange: (index: number, field: keyof RowData, value: any) => void;
};

interface optionValues {
  value:number,
  label : string
}
const token =localStorage.getItem('token')

function TableRows({ rowsData, deleteTableRows, handleChange }: TableRowsProps) {

  const [options, setOptions] = useState<optionValues[]>([{value:0,label:'Loading...'}]);

  const getData = () => {
    axios.get('https://eaf-dms-api.yecor.com/api/inventory/product-SKUs/?warehouse_id=22&ordering=name&search=&limit=100&offset=&remove_product_stocking=true',{
        headers: {
            'Authorization': `Bearer ${token}`,
          },
    })
    .then(response => {
      //console.log(response.data.results);
      
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
        const { batch_number, expiry_date, qty } = data;
        return (
          <tr key={index}>
            <td>
              <Select
                options={options}
                onChange={(selectedOption) => handleChange(index, 'product_id', selectedOption?.value)}
              />
            </td>
            <td style={{display:'flex'}}>
                <h4>#</h4>
              <input
                type="number"
                value={batch_number}
                onChange={(evnt) => handleChange(index, 'batch_number', evnt.target.value)}
                name="batch_number"
                className="form-control"
                placeholder="Enter Batch no" min={0} required

              />
            </td>
            <td>
              <DatePicker
                selected={expiry_date ? new Date(expiry_date) : null}
                onChange={(date) => handleChange(index, 'expiry_date', formatDate(date))}
                className="form-control"
                minDate={new Date()}
              />
            </td>
            <td>
              <input
                type="number"
                value={qty}
                onChange={(evnt) => handleChange(index, 'qty', evnt.target.value)}
                name="qty"
                className="form-control"
                placeholder="Enter Quantity" min={0} required
              />
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

const formatDate = (date: Date | string | null) => {
  if (date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return null;
};


function ProductRows() {

  const initialRow: RowData = {
    product_id: null,
    batch_number: '',
    expiry_date: null,
    qty: '',
  };

  const [rowsData, setRowsData] = useState<RowData[]>([initialRow]);

  const addTableRows = () => {
    const rowsInput: RowData = {
      product_id: null,
      batch_number: '',
      expiry_date: null,
      qty: '',
    };
    setRowsData([...rowsData, rowsInput]);
  };

  const deleteTableRows = (index: number) => {
    if(index > 0){
      const rows = [...rowsData];
      rows.splice(index, 1);
      setRowsData(rows);
    }else{
      toast.error('There must be a single row')
    }
  };

  const resetRows = () => {
    setRowsData([initialRow]);
  };

  const handleChange = (index: number, field: keyof RowData, value: any) => {
    const updatedRowsData = [...rowsData];
    updatedRowsData[index][field] = value;
    setRowsData(updatedRowsData);
  };

  const finalData = {
    "stock_entries": 
        rowsData
        ,
        "stock_type": "FreshProduct",
        "stock_entry_type": "In",
        "receiver_warehouse_id": "62" 
  }

  const handleSubmit = (e:React.SyntheticEvent) =>{
        e.preventDefault();
        
        const hasEmptyFields = rowsData.some((rowData) =>
        Object.values(rowData).some((value) => !value)
        );

        if (hasEmptyFields) {
        toast.warning('Please fill in all fields before submitting.');
        return;
        }
        console.log(rowsData);
        axios.post('https://eaf-dms-api.yecor.com/api/inventory/bulk_stock_in_out/',finalData,
        { 
            headers: {
                'Authorization': `Bearer ${token}`,
             },
        })
        .then(response => {
            console.log(response)
            setRowsData([initialRow]);
            toast.success('Data added successfully')
        })
        .catch(err => console.log(err))
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <table className="table table-bordered table-hover table-striped">
            <thead>
              <tr>
                <th className='col-5' >Product</th>
                <th className='col-3'>Batch No</th>
                <th className='col-2'>Expiry</th>
                <th className='col-5'>Quantity</th>
                <th>
                  <button className="btn btn-outline-success" onClick={addTableRows}>
                    +
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>&nbsp;&nbsp;&nbsp;
          {rowsData.length > 1 && ( 
            <button className="btn btn-danger ml-2" onClick={resetRows}>
              Reset
            </button>
          )}
        </div>
        <div className="col-sm-4"></div>
      </div>
    </div>
  );
}

export default ProductRows;
