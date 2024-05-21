"use client";

import { FormSections } from "@/components/form/form-section";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { NewMapForm } from "@/components/form/new-map-form";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { BackIcon } from "@/icons/back-icon";

export default function MapPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const [center, setCenter] = useState([47.497912, 19.040235]);
  const [zoom, setZoom] = useState(14);

  const session = useSession();

  if (!session) {
    return (
      <div className="w-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Logbook</h1>
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

  if (session.data?.user.role !== UserRole.OPERATOR) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">Create New Map</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"You have no perrmisson!"}
              description={
                "You are not allowed to create a map, this feature is only available to operators!"
              }
            />
          </CardBody>
        </Card>
        <br />
      </div>
    );
  }

  return (
    <div className="p-5 h-full">
      <Card className="w-full mobile:w-[400px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <Link href={"/map"} className="pb-3 text-sm flex">
            <BackIcon />
            <span className="pl-3">{"back to list of maps"}</span>
          </Link>
          <h1 className="text-[30px]">Create New Map</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Create map for association"}
              description={
                "Use the form and map to create a map of your association. To set up, you need the centre of the lake and the name of the association to which the map belongs"
              }
            />
            <NewMapForm center={[center[0], center[1]]} zoom={zoom} />
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
