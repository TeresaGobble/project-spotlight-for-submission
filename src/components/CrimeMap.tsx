import { LatLngExpression } from "leaflet";
import React, { useContext, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { CrimesContext } from "../CrimesContext";

const SetViewOnClick = ({ mapCenter, zoomRate }: { mapCenter: LatLngExpression, zoomRate: number }) => {
  const map = useMap();
  map.setView(mapCenter, zoomRate);

  return null;
}

const CrimeMap = () => {
  const { crimes = [], mapCenter = [0, 0], zoomRate = 0 } = useContext(CrimesContext);
  //array containing crimes that fit the user's entered criteria

  const crimesWithCoordinates = useMemo(() => {
    return crimes.filter(({ longitude }) => !!longitude);
  }, [crimes])

  return (
    <>
      <MapContainer center={mapCenter} zoom={zoomRate} scrollWheelZoom={false}>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {crimesWithCoordinates.map((crime) => (
          <Marker key={crime.id} position={[parseFloat(crime.latitude), parseFloat(crime.longitude)]}>
            <Popup>
              {crime.primary_type}<br /> {crime.description}
            </Popup>
          </Marker>
        ))}
        <SetViewOnClick
          mapCenter={mapCenter}
          zoomRate={zoomRate}
        />
      </MapContainer>
    </>
  )

}

export default CrimeMap;