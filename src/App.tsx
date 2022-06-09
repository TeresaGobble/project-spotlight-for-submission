import React from 'react';
import './App.css';
import { CrimesContextProvider } from './CrimesContext';
import Dropdowns from './components/Dropdowns';
import SearchTable from './components/SearchTable';
import Footer from './components/Footer';
import CrimeMap from './components/CrimeMap';

const App = () => {
  return (
    //note that CrimesContextProvider acts as a wrapper, and provides a shared global scope to all that are inside it no matter the nested level.
    <div id="app-root">
      <img className="logo" alt="binoculars" src="https://i.imgur.com/22s0voU.png"></img>
      <h1 className="title" >Project Spotlight</h1>
        <CrimesContextProvider>
          <div className="dropdown">
          <Dropdowns />
          </div>
          <SearchTable />
          <Footer />
          <div className="map">
            <CrimeMap />
          </div>
        </CrimesContextProvider>
      <div className="note" >Note: if a crime does not specify a location, it will not render on the map.</div>
    </div>
  );
};

export default App;
