import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Edit from "../../assets/edit.png";
import Delete from "../../assets/delete.png";
import DeleteAll from "../../assets/deleteAll.png";

const DataTable = (props) => {
  const [editRowsModel, setEditRowsModel] = useState({});
  const [editedData, setEditedData] = useState({});
  const [editData, setEditData] = useState(false);
  const [localSelectionModel, setLocalSelectionModel] = useState([]);


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

  // HANDLE DELETE FUNCTION
  const handleDelete = (id) => {
    const updatedRows = props.rows.filter((row) => row.id !== id);

    props.onDelete(updatedRows);
  };

  // HANDLE DELETE SELECTED FUNCTION
  const handleDeleteSelected = () => {
    const selectedIds = localSelectionModel || [];
    const updatedRows = props.rows.filter(
      (row) => !selectedIds.includes(row.id.toString())
    );

    props.onDelete(updatedRows);

    if (props.onRowSelectionModelChange) {
      props.onRowSelectionModelChange([]);
    }
  };

  // HANDLE DELETE ALL FUNCTION
  const handleDeleteAll = () => {
    props.onDelete([]);
  };

  // HANDLE EDIT ROW DOUBLE CLICK FUNCTION
  const handleEditRowsModelChange = (params) => {
    console.log("Rows in edit mode:", params.api.current.getSelectedRows());
    setEditRowsModel(params.model);

    if (props.onRowSelectionModelChange) {
      const selectedIds = params.api.current
        .getSelectedRows()
        .map((row) => row.id);
      setLocalSelectionModel(selectedIds);
      props.onRowSelectionModelChange(selectedIds);
    }
  };

  // HANDLE EDIT FUNCTION
  const handleEditButtonClick = (id) => {
    const editedRowId = id;

    if (editedRowId) {
      const editedRow = props.rows.find((row) => row.id === editedRowId);
      setEditedData(editedRow);
    }

    setEditData(true);
  };

  //   EDIT DATA MODAL
  const renderModal = () => {
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

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

            <button className="save" type="button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </form>
        </div>
      );
    }

    return null;
  };

  // Logic to update the original data with edited values
  const handleSaveChanges = () => {
    const updatedRows = props.rows.map((row) =>
      row.id === editedData.id ? { ...row, ...editedData } : row
    );

    props.onSaveChanges(updatedRows);

    setEditData(false);
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

      {localSelectionModel.length > 0 ? (
        <button className="deleteAll" onClick={() => handleDeleteSelected()}>
          Delete selected <img src={DeleteAll} alt="deleteAll" />
        </button>
      ) : (
        <button className="deleteAll" onClick={handleDeleteAll}>

          Delete all
          <img src={DeleteAll} alt="deleteAll" />
        </button>
      )}

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
              printOptions: { disableToolbarButton: true },
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
        setRowSelectionModel={localSelectionModel}
        onRowSelectionModelChange={(setRowSelectionModel) => {
          setLocalSelectionModel(setRowSelectionModel);
          if (props.onRowSelectionModelChange) {
            props.onRowSelectionModelChange(setRowSelectionModel);
          }
        }}
      />
    </div>
  );
};

export default DataTable;
