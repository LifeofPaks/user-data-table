import React, { useEffect, useState } from 'react';
import DataTable from '../DataTable/DataTable';


const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 350, type: 'string', editable: true },
  { field: 'email', headerName: 'Email', width: 350, type: 'string',  editable: true  },
  { field: 'role', headerName: 'Role', width: 300, type: 'string',  editable: true  },

];

const Users = () => {
  const [userRows, setUserRows] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        const resData = await res.json();
        setUserRows(resData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);

  // Update the state with the edited rows
  const handleSaveChanges = (updatedRows) => {
    setUserRows(updatedRows);
  };
  
  // Handle the updated rows, for example, update the state with the new rows
  const handleDelete = (updatedRows) => {
    setUserRows(updatedRows);
    // Here you can set the state or perform any other actions with the updated rows
  };



  return (
    <div className="users">
      <DataTable columns={columns} rows={userRows} onSaveChanges={handleSaveChanges} onDelete={handleDelete}/>
      
    </div>
  );
};

export default Users;
