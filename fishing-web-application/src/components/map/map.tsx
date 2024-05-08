import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useState } from "react";
import { Icon } from "leaflet";

interface Map {
    center:  [number, number]
    setCenter: any
    zoom: number,
    setZoom: any
}

const Map = ({center, setCenter, zoom, setZoom}: Map) => {
  
  const MapClickHandler = () => {
    
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCenter([lat, lng]);
        map.flyTo(e.latlng, map.getZoom());
      },
      zoomend(e){
        setZoom(e.target._zoom)
      }
    });
    return null;
  };

  const defaultIcon = new Icon({
    iconUrl: "https://img.icons8.com/glyph-neue/64/0976F5/marker--v1.png",
    iconSize: [40, 40]
  });

  return (
    <div className="p-3 w-full h-screen rounded-lg overflow-hidden">
      <MapContainer
        center={[center[0], center[1]]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%"}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />

        <Marker position={[center[0], center[1]]} icon={defaultIcon}>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
