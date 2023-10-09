import React, { useState } from 'react';
import axios from 'axios';

interface Row {
  name: string;
  age: string;
}

function TableWithButtons() {
  const [rows, setRows] = useState<Row[]>([]);
  const [newRow, setNewRow] = useState<Row>({ name: '', age: '' });

  const addRow = () => {
    setRows([...rows, { ...newRow }]);
  };

  const removeRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    setNewRow((prevNewRow) => ({
      ...prevNewRow,
      [name]: value,
    }));
  };


  const postData = () => {
    // axios
    //   .post('your_server_url', rows)
    //   .then((response) => {
    //     // Handle the server response
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     // Handle errors
    //     console.error(error);
    //   });
    console.log(rows);
    
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="name"
                  value={row.name}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="age"
                  value={row.age}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => removeRow(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={addRow}>
        Add Row
      </button>
      <button className="btn btn-success" onClick={postData}>
        Post Data
      </button>
    </div>
  );
}

export default TableWithButtons;
