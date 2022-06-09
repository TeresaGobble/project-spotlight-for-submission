import React, { useState, useContext, useMemo } from "react";
import { CrimesContext } from "../CrimesContext";
// import geocodeToken from "../geocode-config";

import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { crimeInfo } from "../crimeInfo";

const { REACT_APP_GEOCODE_API } = process.env;

const Dropdowns = () => {
  const { setCrimes = () => {}, setZoomRate = () => {}, setMapCenter = () => {} } = useContext(CrimesContext);
  const [location, setLocation] = useState("");
  const [primaryType, setPrimaryType] = useState("");
  const [description, setDescription] = useState("");
  const [searchRadius, setSearchRadius] = useState("5");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const [open, setOpen] = React.useState(false);
  const [openDate, setOpenDate] = React.useState(false);
  const [openCrime, setOpenCrime] = React.useState(false);
  const [openSub, setOpenSub] = React.useState(false);
  const [openLocation, setOpenLocation] = React.useState(false);
  const [openRadius, setOpenRadius] = React.useState(false);

  const subcategoryOptions = useMemo(() => {
    if (primaryType !== '') {
      return crimeInfo[primaryType];
    } else {
      return [];
    }
  }, [primaryType]);

  const getSearchedCrime = (primaryType: string, description: string, location: string, searchRadius: string): any => {

    if (primaryType === '' || startDate === null || endDate === null) {
      window.alert('Please select both a Crime and Date before searching');
    } else {
      if (searchRadius) {
        const zoomRatesBySearchRadiusSize: { [key:string]: number } = {
          "1": 14,
          "5": 12,
          "10": 11,
          "25": 10,
          "50": 10,
          "100": 10
        }
        setZoomRate(zoomRatesBySearchRadiusSize[searchRadius]);
      } else {
        setZoomRate(11);
      }

      // conditionals for rendering each dropdown as optional
      if (description !== '') {
        description = "&description=" + description;
      }
      if (location !== '') {
        location = location + '+';
      }

      // setting the default search radius
      let longitude = -87.6243;
      let latitude = 41.8757;

      let newStartDate = startDate.toISOString().slice(0, 10);
      let newEndDate = endDate.toISOString().slice(0, 10);

      // Calling both APIs
      var requestOptions = {
        method: "GET",
      };

      fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${location}Chicago+IL&apiKey=${REACT_APP_GEOCODE_API}`, requestOptions)
        .then(response => response.json())
        .then(result => {

          longitude = result.features[0].properties.lon;
          latitude = result.features[0].properties.lat;

          setMapCenter([latitude, longitude]);

          let geoAppifyResult = {
            easternmostLongitude: longitude + 0.015 * parseInt(searchRadius),
            westernmostLongitude: longitude - 0.015 * parseInt(searchRadius),
            northernmostLatitude: latitude + 0.015 * parseInt(searchRadius),
            southernmostLatitude: latitude - 0.015 * parseInt(searchRadius)
          }
          return geoAppifyResult;
        })
        .then(geoAppifyResult => {

          const result = fetch(`https://data.cityofchicago.org/resource/ijzp-q8t2.json?primary_type=${primaryType}${description}&$where=latitude >= ${geoAppifyResult.southernmostLatitude} AND latitude <= ${geoAppifyResult.northernmostLatitude} AND longitude >= ${geoAppifyResult.westernmostLongitude} AND longitude <= ${geoAppifyResult.easternmostLongitude} AND date >= "${newStartDate}T00:00:00.000" AND date <= "${newEndDate}T23:59:59.999"`)
          return result;
        })
        .then(response => response.json())
        .then((result) => {
          setCrimes(result);
        })
        .catch(error => console.log('error', error));
    }
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: 336,
    left: 1136,
    width: 303,
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #a9a9a9',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'
  };

  return (
    <>
      <div className="name-and-info-section">
        <div className="name-and-info-item">
          <div>Location  </div>
            <img alt="read more" className="dropdown-limitations" src="https://i.imgur.com/qDvTXf9.png" onClick={() => setOpenLocation(true)}></img>
            <Modal open={openLocation}>
              <Box className="location-box" onMouseLeave={() => setOpenLocation(false)}>
                <p id="modal-text">
                  This can be as specific as an address or as broad as a zipcode!
                </p>
              </Box>
            </Modal>
          </div>

        <div className="name-and-info-item">
          <div>Crime  </div>
          <img alt="read more" className="dropdown-limitations" src="https://i.imgur.com/qDvTXf9.png" onClick={() => setOpenCrime(true)}></img>
            <Modal open={openCrime}>
              <Box className="crime-box" sx={{ width: 200 }} onMouseLeave={() => setOpenCrime(false)}>
                <p id="modal-text">
                  Required Category.
                  This is a list of every "primary type" of crime as defined by the city of Chicago.
                </p>
              </Box>
            </Modal>
        </div>

        <div className="name-and-info-item">
          <div>Subcategory  </div>
          <img alt="read more" className="dropdown-limitations" src="https://i.imgur.com/qDvTXf9.png" onClick={() => setOpenSub(true)}></img>
            <Modal open={openSub}>
              <Box className="sub-box" sx={{ width: 200 }} onMouseLeave={() => setOpenSub(false)}>
                <p id="modal-text">
                  This list reflects the subcategories of your chosen crime category.
                </p>
              </Box>
            </Modal>
        </div>

        <div className="name-and-info-item">
          <div>Search Area  </div>
          <img alt="read more" className="dropdown-limitations" src="https://i.imgur.com/qDvTXf9.png" onClick={() => setOpenRadius(true)}></img>
            <Modal open={openRadius}>
              <Box className="radius-box" sx={{ width: 200 }} onMouseLeave={() => setOpenRadius(false)}>
                <p id="modal-text">
                  If no search radius is chosen, the map will automatically populate results within a 1 mile radius.
                </p>
              </Box>
            </Modal>
        </div>

        <div className="name-and-info-item">
          <div>Date  </div>
          <img alt="read more" className="dropdown-limitations" src="https://i.imgur.com/qDvTXf9.png" onClick={() => setOpenDate(true)}></img>
            <Modal open={openDate}>
              <Box className="date-box" sx={{ width: 200 }} onMouseLeave={() => setOpenDate(false)}>
                <p id="modal-text">
                  Required Category.
                  All crimes are added to our dataset 7 days after initial reporting.
                  Thank you for your patience!
                </p>
              </Box>
            </Modal>
        </div>
      </div>
      <div className="dropdown-selections">
        <input placeholder="Enter Address" onChange={(e) => setLocation(e.target.value)}></input>
        <select className="dropdown-set-primary-type" placeholder="Select Crime" onChange={(e) => setPrimaryType(e.target.value.toUpperCase())}>
          <option value="Select Crime...">Select Crime...</option>
          <option value="arson">ARSON</option>
          <option value="assault">ASSAULT</option>
          <option value="homicide">HOMICIDE</option>
          <option value="battery">BATTERY</option>
          <option value="burglary">BURGLARY</option>
          <option value="concealed carry license violation">CONCEALED CARRY LICENSE VIOLATION</option>
          <option value="criminal abortion">CRIMINAL ABORTION</option>
          <option value="criminal damage">CRIMINAL DAMAGE</option>
          <option value="criminal sexual assault">CRIMINAL SEXUAL ASSAULT</option>
          <option value="criminal trespass">CRIMINAL TRESPASS</option>
          <option value="deceptive practice">DECEPTIVE PRACTICE</option>
          <option value="gambling">GAMBLING</option>
          <option value="human trafficking">HUMAN TRAFFICKING</option>
          <option value="interference with public officer">INTERFERENCE WITH PUBLIC OFFICER</option>
          <option value="intimidation">INTIMIDATION</option>
          <option value="kidnapping">KIDNAPPING</option>
          <option value="liqour law violation">LIQUOR LAW VIOLATION</option>
          <option value="motor vehicle theft">MOTOR VEHICLE THEFT</option>
          <option value="narcotics">NARCOTICS</option>
          <option value="non-criminal">NON-CRIMINAL</option>
          <option value="obscenity">OBSCENITY</option>
          <option value="offense involving children">OFFENSE INVOLVING CHILDREN</option>
          <option value="other narcotic violation">OTHER NARCOTIC VIOLATION</option>
          <option value="other offense">OTHER OFFENSE</option>
          <option value="prostitution">PROSTITUTION</option>
          <option value="public indecency">PUBLIC INDECENCY</option>
          <option value="public peace violation">PUBLIC PEACE VIOLATION</option>
          <option value="ritualism">RITUALISM</option>
          <option value="robbery">ROBBERY</option>
          <option value="sex offense">SEX OFFENSE</option>
          <option value="stalking">STALKING</option>
          <option value="theft">THEFT</option>
          <option value="weapons violation">WEAPONS VIOLATION</option>
        </select>
        <select placeholder="Select Subcategory" onChange={(e) => setDescription(e.target.value)}>
          <option value="Select Subcategory...">Select Subcategory...</option>
          {subcategoryOptions.map((subcategory, i) =>
            <option key={i} value={subcategory}>{subcategory}</option>
          )}
        </select>
        <select className="dropdown-set-search-radius" placeholder="Select Search Area" onChange={(e) => setSearchRadius(e.target.value)}>
          <option value="no-change">Select Search Area...</option>
          <option value="1">1 mile</option>
          <option value="5">5 miles</option>
          <option value="10">10 miles</option>
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
          <option value="100">100 miles</option>
        </select>
        <button className="date-button" placeholder="Select Date" onClick={() => setOpen(true)}>Select Date Range...</button>
        <Modal className="modal-creators"
          open={open}
          onBackdropClick={() => setOpen(false)}
        >
          <Box sx={style} >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Select Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Select End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Modal>
        <img className="search-icon" alt="magnifying glass" src="https://i.imgur.com/LLgt3ke.png" onClick={() => getSearchedCrime(primaryType, description, location, searchRadius)}></img>
      </div>
    </>
  )
}

export default Dropdowns;