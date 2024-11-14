import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [favorite, setFavorite] = useState(
    JSON.parse(localStorage.getItem('favorites')) || []
  );

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data);
        setFilteredCountries(response.data);
      })
      .catch((error) => console.error('API fetch failed', error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const results = countries.filter(
      (country) =>
        country.name.common.toLowerCase().includes(query) ||
        Object.values(country.languages || {}).some((lang) =>
          lang.toLowerCase().includes(query)
        ) ||
        Object.values(country.currencies || {}).some((currency) =>
          currency.name.toLowerCase().includes(query)
        )
    );
    setFilteredCountries(results);
  };

  const handleFavorite = (country) => {
    setFavorite((prev) =>
      prev.some((fav) => fav.name.common === country.name.common)
        ? prev.filter((fav) => fav.name.common !== country.name.common)
        : [...prev, country]
    );
  };

  const gridOptions = {
    defaultColDef: {
      sortable: false
  },
    columnDefs: [
      { field: 'name.common', headerName: 'Country Name', sortable: true },
      { field: 'population', headerName: 'Population', sortable: true },
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
      {
        headerName: 'Actions',
        cellRenderer: (params) => {
          const isFavorite = favorite.some(
            (fav) => fav.name.common === params.data.name.common
          );
          return (
            <button onClick={() => handleFavorite(params.data)}>
              {isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}
            </button>
          );
        },
      },
    ],
    rowData: filteredCountries,
    pagination: true,
    paginationPageSize: 10,
  };
  return (
    <div className="App">
      <h1>Countries Info</h1>
      <input
        type="text"
        placeholder="Search by name, language, currency"
        value={search}
        onChange={handleSearch}
      />
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        columnDefs={gridOptions.columnDefs}
        rowData={filteredCountries}
        pagination={gridOptions.pagination}
        paginationPageSize={gridOptions.paginationPageSize}
      />
      </div>
      <h2>Favorite Countries:</h2>
      <ul>
        {favorite.map((fav) => (
          <li key={fav.name.common}>
            {fav.name.common}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default App;

