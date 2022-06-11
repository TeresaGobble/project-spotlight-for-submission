import React, { useContext } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CrimesContext } from '../CrimesContext';
import { Crime } from "../types/crime";

const SearchTable = () => {

  const { crimes = [] } = useContext(CrimesContext);

  const columns: GridColDef[] = [
      { field: 'id', headerName: '#', width: 0, hide: true},
      { field: 'date', headerName: 'Date', width: 100},
      { field: 'time', headerName: 'Time', width: 60, sortable: false},
      { field: 'crime', headerName: 'Crime', width: 110, sortable: false},
      { field: 'description', headerName: 'Description', width: 200, sortable: false},
      { field: 'street', headerName: 'Street', width: 180, sortable: false}
  ];

  const rows = crimes.map((e: Crime, i: number) => {
    let date = e.date.slice(0, 4) + '/' + e.date.slice(5, 7) + '/' + e.date.slice(8, 10);
    return {
        id: i + 1,
        date: date,
        time: e.date.slice(11, 16),
        crime: e.primary_type,
        description: e.description,
        street: e.block.slice(6)
    };
  });

  return (
    <div>
      <div className="table" style={{height: 1, width: '40%', borderRadius: "10px"}}>
          <DataGrid
            rows={rows}
            columns={columns}
            style={{top: '302px', left:'692px', height: '550px', width: '685px', borderRadius: "10px"}}
            rowsPerPageOptions={[rows.length]}
          />
      </div>
    </div>
  )
}

export default SearchTable;