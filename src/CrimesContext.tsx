import React, { createContext, useState } from "react";
import { Crime } from "./types/crime";

interface CrimesContextInterface {
  crimes: Crime[];
  setCrimes: React.Dispatch<React.SetStateAction<Crime[]>>;
  mapCenter: [number, number];
  setMapCenter: React.Dispatch<React.SetStateAction<[number, number]>>;
  zoomRate: number;
  setZoomRate: React.Dispatch<React.SetStateAction<number>>;
}

const CrimesContext = createContext<Partial<CrimesContextInterface>>({}); //setting CrimesContext as the context

const CrimesContextProvider = (props: React.PropsWithChildren) => { // this acts as the wrapper for the components who must use the same state (essentially as a customized global scope, since all the children and children's children should be able to access this correctly without drilling)

  const [crimes, setCrimes] = useState([] as Crime[]);
  const [mapCenter, setMapCenter] = useState([41.8757, -87.6243] as [number, number]); // default is Downtown Chicago
  const [zoomRate, setZoomRate] = useState(11);

  const CrimesProviderValue: Partial<CrimesContextInterface> = {
    crimes,
    setCrimes,
    mapCenter,
    setMapCenter,
    zoomRate,
    setZoomRate
  }

  return (
    <CrimesContext.Provider value={ CrimesProviderValue }>
        { props.children }
    </CrimesContext.Provider>
  )
}

export { CrimesContext, CrimesContextProvider }
