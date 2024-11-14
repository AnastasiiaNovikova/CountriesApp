import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data);
        console.log("response:", response);
      })
      .catch((error) => console.error('API fetch failed', error));
  }, []);

  const gridOptions = {
    columnDefs: [
      { field: 'name.common', headerName: 'Country Name' },
      { field: 'population', headerName: 'Population' },
      {
        headerName: 'Languages',
        valueGetter: (params) =>
          params.data.languages
            ? Object.values(params.data.languages).join(', ')
            : 'N/A',
      },
      {
        headerName: 'Currencies',
        valueGetter: (params) =>
          params.data.currencies
            ? Object.values(params.data.currencies)
                .map((currency) => currency.name)
                .join(', ')
            : 'N/A',
      },
    ],
    rowData: countries,
    pagination: true,
    paginationPageSize: 10,
  };
  return (
    <div className="App">
      <h1>Countries Info</h1>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        columnDefs={gridOptions.columnDefs}
        rowData={countries}
        pagination={gridOptions.pagination}
        paginationPageSize={gridOptions.paginationPageSize}
      />
      </div>
    </div>
  );
};
export default App;

