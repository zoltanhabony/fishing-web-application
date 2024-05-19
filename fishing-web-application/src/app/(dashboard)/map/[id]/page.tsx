"use client";

import { FormSections } from "@/components/form/form-section";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { useMapById, useMarkersByMap, useUserAccess } from "@/services/queries";
import { useRouter } from "next/navigation";

interface MarkerCreatePageProps {
  params: {
    id: string;
  };
}

export default function ViewMapPage(props: MarkerCreatePageProps) {
  const map = useMapById(props.params.id);
  const markers = useMarkersByMap(props.params.id);
  const access = useUserAccess()

  const revalidateMarker = () => {
    markers.mutate();
    map.mutate();
  };


  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map/staticMap"), {
        loading: () => <p>A map is loading</p>,
      }),
    []
  );

  const [center, setCenter] = useState([47.497912, 19.040235]);
  const [zoom, setZoom] = useState(14);

  const router = useRouter();

  useEffect(() => {
;
    if (!map.isLoading && map.data) {
      setCenter([Number(map.data.map?.lat), Number(map.data.map?.long)]);
      setZoom(Number(map.data.map?.zoom));
  
    }
  }, [map.data, map.isLoading]);

  if (map.isLoading || markers.isLoading || access.isLoading) {
    return (
      <div className="p-5 h-full overflow-hidden block">
      <Card className="w-full mobile:w-[400px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">View Map</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Find your way around the map"}
              description={
                "Use the form and map to create a map of your association. To set up, you need the centre of the lake and the name of the association to which the map belongs"
              }
            />
          </div>
          <p>Map is loading...</p>
        </CardBody>
        </Card>
        </div>
    );
  }

  return (
    <div className="p-5 h-full overflow-hidden block">
      <Card className="w-full mobile:w-[400px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">View Map</h1>
          <h2 className="text-primary font-bold">
            {map.data
              ? `${map.data.map?.fisheryAuthority.fisheryAuthorityName}'s map`
              : ""}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Find your way around the map"}
              description={
                "Use the form and map to create a map of your association. To set up, you need the centre of the lake and the name of the association to which the map belongs"
              }
            />
          </div>
          <br />
          {access.data?.access ? (access.data.access.accessToMarker ? <Button
            color="primary"
            onClick={() => router.push(`/map/${props.params.id}/marker/new`)}
          >
            Create Marker
          </Button> : ""): ""}
        </CardBody>
      </Card>
      <Map
        mapId={props.params.id}
        center={[center[0], center[1]]}
        setCenter={setCenter}
        zoom={zoom}
        setZoom={setZoom}
        markers={markers.data?.markers}
        revalidateMarker={revalidateMarker}
      />
    </div>
  );
}
