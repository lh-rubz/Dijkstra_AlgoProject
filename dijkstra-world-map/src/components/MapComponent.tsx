import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  data: { countryName: string; coordinates: LatLngTuple }[];
}

const MapComponent: React.FC<MapComponentProps> = ({ data }) => {
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    // Only reinitialize the map when the data changes (or on mount)
    setMapKey(prevKey => prevKey + 1);
  }, [data]);

  return (
    <MapContainer key={mapKey} center={[51.505, -0.09]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((item, index) => (
        <Marker key={index} position={item.coordinates}>
          <Popup>{item.countryName}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
