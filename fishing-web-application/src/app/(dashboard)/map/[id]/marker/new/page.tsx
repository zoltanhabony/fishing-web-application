"use client";

import { FormSections } from "@/components/form/form-section";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { useMapById, useUserAccess } from "@/services/queries";
import { NewMarkerForm } from "@/components/form/new-marker-form";
import { useSession } from "next-auth/react";
import { accessSync } from "fs";

interface MarkerCreatePageProps {
  params: {
    id: string;
  };
}

export default function CreateMarkerPage(props: MarkerCreatePageProps) {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
);

  const map = useMapById(props.params.id);

  const [center, setCenter] = useState([47.497912, 19.040235]);
  const [zoom, setZoom] = useState(14);
  const session = useSession()

  const access = useUserAccess()

  useEffect(() => {
    if (!map.isLoading && map.data) {
      setCenter([Number(map.data.map?.lat), Number(map.data.map?.long)]);
      setZoom(Number(map.data.map?.zoom));
    }
  }, [map.data, map.isLoading]);

  if (map.isLoading && access.isLoading) {
    return <div>Map data is loading...</div>;
  }
  
  if (!session) {
    return (
      <div className="w-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Create New Marker</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Authorization failed!"}
              description={"There is no valid session! Sign in again!"}
            />
          </div>
        </CardBody>
      </Card>
      </div>
    );
  }

  console.log(access.data?.access?.accessToMarker)
  if(!access.data?.access || !access.data.access.accessToMarker){
    return (
      <div className="w-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Create New Marker</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"You cannot mark a point on the map"}
              description={"You do not have access to mark points!"}
            />
          </div>
        </CardBody>
      </Card>
      </div>
    );
  }

  return (
    <div className="p-5 h-full overflow-hidden block">
      <Card className="w-full mobile:w-[400px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">Create New Marker</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Create marker"}
              description={
                "Use the form and map to create a map of your association. To set up, you need the centre of the lake and the name of the association to which the map belongs"
              }
            />
            <NewMarkerForm center={[center[0], center[1]]} id={props.params.id}/>
          </div>
        </CardBody>
      </Card>
      <Map
        center={[center[0], center[1]]}
        setCenter={setCenter}
        zoom={zoom}
        setZoom={setZoom}
      />
    </div>
  );
}
