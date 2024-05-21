"use client";

import { FormSections } from "@/components/form/form-section";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { useMapById, useMarkerById, useUserAccess } from "@/services/queries";
import { EditMarkerForm } from "@/components/form/edit-marker-form";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { BackIcon } from "@/icons/back-icon";

interface MarkerCreatePageProps {
  params: {
    id: string;
    markerId: string;
  };
}

export default function EditMarkerPage(props: MarkerCreatePageProps) {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const session = useSession();

  const map = useMapById(props.params.id);
  const marker = useMarkerById(props.params.markerId);
  const access = useUserAccess();

  const [center, setCenter] = useState([47.497912, 19.040235]);
  const [zoom, setZoom] = useState(14);
  const [markerPos, setMarkerPos] = useState([47.497912, 19.040235]);

  useEffect(() => {
    if (!map.isLoading && map.data) {
      setCenter([Number(map.data.map?.lat), Number(map.data.map?.long)]);
      setZoom(Number(map.data.map?.zoom));
    }

    if (!marker.isLoading && marker.data) {
      setMarkerPos([
        Number(marker.data.marker?.lat),
        Number(marker.data.marker?.long),
      ]);
    }
  }, [map.data, map.isLoading, marker.data, marker.isLoading]);

  if (map.isLoading || marker.isLoading || access.isLoading) {
    return <div>Map data is loading...</div>;
  }

  if (!session) {
    return (
      <div className="w-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Edit Marker</h1>
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

  if (!access.data?.access || !access.data.access.accessToMarker) {
    return (
      <div className="w-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Edit Marker</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title={"You cannot edit this marker!"}
                description={"You do not have access to edit markers!"}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (map.data === undefined || marker.data === undefined) {
    return (
      <div className="w-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Edit Marker</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title={"The map or marker does not exist!"}
                description={
                  "The marker in map you wish to edit does not exist"
                }
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
          <Link href={`/map/${props.params.id}`} className="pb-3 text-sm flex">
            <BackIcon />
            <span className="pl-3">{"back to the map"}</span>
          </Link>
          <h1 className="text-[30px]">Edit Marker</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            {marker.data?.marker ? (
              <FormSections
                title={"Edit marker"}
                description={
                  "Use the form and the map to modify the marker. The data on the form and the marker on the map represent the current data and position"
                }
              />
            ) : (
              <FormSections
                title={"You have no perrmisson!"}
                description={
                  "You are not allowed to edit this marker. The marker is not yours!"
                }
              />
            )}

            {marker.data?.marker ? (
              <EditMarkerForm
                center={[markerPos[0], markerPos[1]]}
                id={props.params.id}
                title={
                  marker.data?.marker?.title
                    ? String(marker.data?.marker?.title)
                    : ""
                }
                info={
                  marker.data?.marker?.info
                    ? String(marker.data?.marker?.info)
                    : ""
                }
                markerType={
                  marker.data?.marker?.markerType.id
                    ? String(marker.data?.marker?.markerType.id)
                    : ""
                }
                markerId={props.params.markerId}
              />
            ) : (
              ""
            )}
          </div>
        </CardBody>
      </Card>
      {marker.data?.marker ? (
        <Map
          center={[markerPos[0], markerPos[1]]}
          setCenter={setMarkerPos}
          zoom={zoom}
          setZoom={setZoom}
        />
      ) : (
        ""
      )}
    </div>
  );
}
