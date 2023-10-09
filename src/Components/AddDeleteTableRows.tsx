import React, { useState } from "react";
import TableRows from "./TableRows";

interface RowData {
  product: string;
  batch_no: string;
  expiry: string;
  qty:string;
}

function AddDeleteTableRows() {
  const [rowsData, setRowsData] = useState<RowData[]>([]);

  const handleSubmit = (e:React.SyntheticEvent) => {
    e.preventDefault();
    console.log(rowsData); 
  }

  const addTableRows = () => {
    const rowsInput: RowData = {
      product: "",
      batch_no: "",
      expiry: "",
      qty: "",
    };
    setRowsData([...rowsData, rowsInput]);
  };

  const deleteTableRows = (index: number) => {
    if(index !== 0){
      const rows = [...rowsData];
      rows.splice(index, 1);
      setRowsData(rows);
    }else{
      alert('Minimum 1 row is required')
    }
    
  };

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name as keyof RowData] = value;
    setRowsData(rowsInput);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-8">
        <table className="table table-bordered table-hover table-striped">
            <thead>
                <tr>
                <th className="col-5">Product SKU</th>
                <th className="col">Batch Number</th>
                <th className="col">Expiry Date</th>
                <th className="col">Inward Qty</th>
                <th>
                  <button className="btn btn-outline-success" onClick={addTableRows}>
                    +
                  </button>
                </th>
                </tr>
            </thead>
            <tbody>
              <TableRows rowsData={rowsData} handleChange={handleChange} deleteTableRows={deleteTableRows}  />
            </tbody>
          </table>
        </div>
        <div className="col-sm-4">
          <input type="submit" value="submit" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default AddDeleteTableRows;
