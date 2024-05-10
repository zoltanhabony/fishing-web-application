"use server"
import { getAllMap } from "@/actions/db-actions/map-actions/get-all-map";
import { auth } from "@/auth";
import { MapCard } from "@/components/card/map-card";
import { FormSections } from "@/components/form/form-section";
import { BottomPagination } from "@/components/pagination/bottom-pagination";
import { Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react";


export default async function MapPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    search?: string;
  };
}) {
  const session = await auth();
  
  const page = searchParams?.page || "1";
  const search = searchParams?.search || "";

  const mapList = await getAllMap(page,search)

  const pages = Math.ceil(mapList.numberOfMaps / 12)

  const MapCardsPromise = mapList.maps.map(async (map)=>
    await <MapCard key={map.id} authorityName={map.fisheryAuthority.fisheryAuthorityName} waterAreaName={map.fisheryAuthority.waterArea.waterAreaName} lat={map.lat.toString()} long={map.long.toString()} isAuthor={await map.isAuthor} mapId={map.id}/>
  )

  const MapCards = await Promise.all(MapCardsPromise);


  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Map</h1>
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
    );
  }

    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">Maps</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"Maps of associations"}
              description={
                "Below are maps of the associations, if they have been created. Not all associations have maps. The maps allow you to find your way around the lake"
              }
            />
            <br />
            {session.user.role === "OPERATOR" ?  <Button
            color="primary"
            href="/map/new"
            as={Link}
          >
            Create Map
          </Button>: ""}
          </CardBody>
        </Card>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-10 mt-16 px-3 ">
        {MapCards}  
        </div>
        <br />
        <div className="w-full flex items-center justify-center">
        <BottomPagination pages={pages}/>
        </div>
      </div>
    );
}
