"use client";

import { FormSections } from "@/components/form/form-section";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { useMapById } from "@/services/queries";
import { EditMapForm } from "@/components/form/edit-map-form";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { BackIcon } from "@/icons/back-icon";

interface MarkerCreatePageProps {
  params: {
    id: string;
  };
}

export default function ViewMapPage(props: MarkerCreatePageProps) {
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

  const session = useSession();

  useEffect(() => {
    if (!map.isLoading && map.data) {
      setCenter([Number(map.data.map?.lat), Number(map.data.map?.long)]);
      setZoom(Number(map.data.map?.zoom));
    }
  }, [map.data, map.isLoading]);

  if (map.isLoading) {
    return <div>Map data is loading...</div>;
  }

  if (!session) {
    return (
      <div className="w-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Edit Map</h1>
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

  if (map.data === undefined) {
    return (
      <div className="w-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Edit Map</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title={"The map does not exist!"}
                description={"The map you wish to edit does not exist"}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (session.data?.user.role !== UserRole.OPERATOR) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">Edit Map</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"You have no perrmisson!"}
              description={
                "You are not allowed to edit map, this feature is only available to operators!"
              }
            />
          </CardBody>
        </Card>
        <br />
      </div>
    );
  }

  return (
    <div className="p-5 h-full overflow-hidden block">
      <Card className="w-full mobile:w-[400px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <Link href={"/map"} className="pb-3 text-sm flex">
            <BackIcon />
            <span className="pl-3">{"back to list of maps"}</span>
          </Link>
          <h1 className="text-[30px]">Edit Map</h1>
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
                "Use the form and map below to edit the map. It allows you to select the centre of the water area, the zoom level and the fishing club to which the map belongs"
              }
            />
          </div>
          <EditMapForm
            center={[center[0], center[1]]}
            zoom={zoom}
            fisheryAuthorityName={
              map.data?.map?.fisheryAuthority.fisheryAuthorityName
            }
            id={map.data?.map?.fisheryAuthority.id}
          />
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
