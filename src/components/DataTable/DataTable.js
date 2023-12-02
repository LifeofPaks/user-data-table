import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Edit from "../../assets/edit.png";
import Delete from "../../assets/delete.png";
import DeleteAll from "../../assets/deleteAll.png";

const DataTable = (props) => {
  const [editRowsModel, setEditRowsModel] = useState({});
  const [editedData, setEditedData] = useState({});
  const [editData, setEditData] = useState(false);

  // HANDLE DELETE FUNCTION
  const handleDelete = (id) => {
    // Remove the row with the specified id from the rows state
    const updatedRows = props.rows.filter((row) => row.id !== id);

    // Call the onDelete callback to notify the parent component
    props.onDelete(updatedRows);

    console.log(id, "has been deleted");
  };

  // HANDLE DELETE ALL FUNCTION
  const handleDeleteAll = () => {
    // Call the onDelete callback with an empty array to delete all rows
    props.onDelete([]);

    console.log("All rows have been deleted");
  };

  const handleEditRowsModelChange = (params) => {
    console.log("Rows in edit mode:", params.api.current.getSelectedRows());
    setEditRowsModel(params.model);
  };

  // HANDLE EDIT FUNCTION
  const handleEditButtonClick = (id) => {
    const editedRowId = id;

    if (editedRowId) {
      const editedRow = props.rows.find((row) => row.id === editedRowId);
      setEditedData(editedRow);
    }

    setEditData(true);

    console.log("Edit button clicked", editedRowId);
  };

  //   EDIT DATA MODAL
  // Update the editedData state based on form input changes
  const renderModal = () => {
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // Logic to update the original data with edited values
    const handleSaveChanges = () => {
      const updatedRows = props.rows.map((row) =>
        row.id === editedData.id ? { ...row, ...editedData } : row
      );

      props.onSaveChanges(updatedRows);

      // Close the modal after saving changes
      setEditData(false);
    };

    // Logic to display an editable form with the details of the edited row
    if (editedData) {
      return (
        <div>
          <h2>Edit Row Details</h2>
          <form>
            <div className="inputWraps">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="inputWraps">
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={editedData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="inputWraps">
                <label>Role</label>
              <input
                type="text"
                name="role"
                value={editedData.role}
                onChange={handleInputChange}
              />
            </div>

            <button type="button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </form>
        </div>
      );
    }

    return null;
  };

  // ACTION COLUMN
  const actionColumn = {
    field: "actions",
    headerName: "ACTIONS",
    width: 90,
    renderCell: (params) => {
      return (
        <div className="actions">
          <button
            className="edit"
            onClick={() => handleEditButtonClick(params.id)}
          >
            <img src={Edit} alt="edit" />
          </button>

          <button
            className="delete"
            onClick={() => handleDelete(params.row.id)}
          >
            <img src={Delete} alt="view" />
          </button>
        </div>
      );
    },
  };

  return (
    <div className="table">
      {editData && (
        <div className="modal">
          <div className="data">{renderModal()}</div>

          <div onClick={() => setEditData(false)} className="close">
            &times;
          </div>
        </div>
      )}

      <button className="deleteAll" onClick={handleDeleteAll}>
        <img src={DeleteAll} alt="deleteAll" />
      </button>

      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{
          toolbar: (props) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "8px",
              }}
            >
              <GridToolbar {...props} />
            </div>
          ),
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        editMode="row"
        editRowsModel={props.editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
      />
    </div>
  );
};

export default DataTable;
