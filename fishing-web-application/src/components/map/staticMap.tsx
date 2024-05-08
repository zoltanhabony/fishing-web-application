import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Decimal } from "@prisma/client/runtime/library";
import { Icon } from "leaflet";
import { MarkerPopup } from "../card/marker-popup-card";

type markers =
  | {
      id: string;
      info: string;
      lat: Decimal;
      long: Decimal;
      member: {
        fisheryAuthority: {
          fisheryAuthorityName: string;
        };
        user: {
          name: string | null;
          firstName: string | null;
          lastName: string | null;
          email: string | null;
          image: string | null;
        };
      };
      markerType: {
        type: string;
        markerURL: string;
      };
      isAuthor: boolean;
      title: string;
      createdAt: Date;
    }[]
  | undefined;

interface StaticMapProps {
  mapId: string;
  center: [number, number];
  setCenter: any;
  zoom: number;
  setZoom: any;
  markers: markers;
  revalidateMarker: () => void;
}

const defaultIcon = new Icon({
  iconUrl: "https://img.icons8.com/glyph-neue/64/0976F5/marker--v1.png",
  iconSize: [40, 40],
});

const Map = ({
  center,
  zoom,
  markers,
  mapId,
  revalidateMarker,
}: StaticMapProps) => {
  return (
    <div className="p-3 w-full h-screen rounded-lg overflow-hidden">
      <MapContainer
        center={[center[0], center[1]]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers?.map((map) => (
          <Marker
            icon={
              new Icon({
                iconUrl: map.markerType.markerURL
                  ? map.markerType.markerURL
                  : "https://img.icons8.com/glyph-neue/64/0093FE/marker--v1.png",
                iconSize: [40, 40],
              })
            }
            key={map.id}
            position={[Number(map.lat), Number(map.long)]}
          >
            <Popup>
              <MarkerPopup
                name={map.member.user.name}
                email={map.member.user.email}
                firstName={map.member.user.firstName}
                lastName={map.member.user.lastName}
                title={map.title}
                info={map.info}
                createdAt={map.createdAt}
                isAuthor={map.isAuthor}
                markerId={map.id}
                mapId={mapId}
                imageURL={map.member.user.image}
                revalidateMarker={revalidateMarker}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
