import db from "@/lib/db";
import notFound from "./not-found";
import { Card, CardBody, CardHeader, Link, Snippet } from "@nextui-org/react";
import { FormSections } from "@/components/form/form-section";
import { FishAvatar } from "@/components/card/fish-card";
import { BackIcon } from "@/icons/back-icon";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

interface LogbookShowPageProps {
  params: {
    id: string;
  };
}

export default async function MemberShowPage(props: LogbookShowPageProps) {

  const session = await auth()

  if(!session){
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">View Catch</h1>
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

  const catchById = await db.catch.findFirst({
    where: {
      id: props.params.id,
    },
    select: {
      id: true,
      waterArea: {
        select: {
          waterAreaCode: true,
          waterAreaName: true,
        },
      },
      logbook: {
        select: {
          member: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      createdAt: true,
      isInjured: true,
      isStored: true,
      fish: {
        select: {
          id: true,
          fishCode: true,
          fishName: true,
          fishImageURL: true,
        },
      },
      CatchDetails: {
        select: {
          value: true,
          unit: {
            select: {
              unitAcronyms: true,
            },
          },
        },
      },
    },
  });

  if (!catchById) {
    return notFound();
  }

  const access = await db.access.findFirst({
    where:{
      user:{
        email: session?.user.email
      }
    }
  })


  const isOwnFish = await db.catch.findUnique({
    where:{
      id: catchById.id,
      logbook:{
        member:{
          user:{
            email: session?.user.email
          }
        }
      }
    }
  })

  const isInWaterArea = await db.member.findFirst({
    where:{
      user:{
        email: session?.user.email
      },
      fisheryAuthority:{
        waterArea:{
          waterAreaName: catchById.waterArea.waterAreaName
        }
      }
    }
  })

  if(isOwnFish && access?.accessToLogbook && access.accessToFishing|| (session.user.role === "OPERATOR" && isInWaterArea) || (isInWaterArea && !isOwnFish && session?.user.role === "INSPECTOR" && access?.accessToCatches)){
    return (
      <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            {session.user.role === UserRole.USER || isOwnFish ? <Link href={"/logbook"} className="pb-3 text-sm flex">
              <BackIcon />
              <span className="pl-3">{"back to list of catches"}</span>
            </Link>: <Link href={"/catch"} className="pb-3 text-sm flex">
              <BackIcon />
              <span className="pl-3">{"back to list of catches"}</span>
            </Link>}
            <h1 className="text-[30px]">Catch Details</h1>
            <h3 className="text-primary">
              {catchById.logbook.member?.user.name + "'s catch"}
            </h3>
            <h3 className="text-secondary text-sm">{"ID: " + catchById.id}</h3>
          </CardHeader>
          <CardBody>
          <FishAvatar fishName={catchById.fish.fishName} fishImageUrl={catchById.fish.fishImageURL}/>
          <br />
            <div className="space-y-3">
  
              <div className="mt-5">
              <FormSections
                title="Fish Data"
                description="The following information displays the fish data"
              />
              </div>
  
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <p className="text-md">Fish type:</p>
                  <p className="text-sm text-primary">
                    {catchById.fish.fishName}
                  </p>
                </div>
  
                <div className="flex items-center space-x-2">
                  <p className="text-md">Fish code:</p>
                  <p className="text-sm text-primary">
                    {catchById.fish.fishCode !== null
                      ? catchById.fish.fishCode
                      : "-"}
                  </p>
                </div>
  
                <div className="flex items-center space-x-2">
                  <p className="text-md">Weight:</p>
                  <p className="text-sm text-primary">
                    {String(catchById.CatchDetails[0].value) !== "0" ? catchById.CatchDetails[0].value +
                      " " +
                      catchById.CatchDetails[0].unit.unitAcronyms : "-"}
                  </p>
                </div>
  
                <div className="flex items-center space-x-2">
                  <p className="text-md">Length:</p>
                  <p className="text-sm text-primary">
                    {String(catchById.CatchDetails[1].value) !== "0" ?catchById.CatchDetails[1].value +
                      " " +
                      catchById.CatchDetails[1].unit.unitAcronyms : "-"}
                  </p>
                </div>
  
                <div className="flex items-center space-x-2">
                  <p className="text-md">Piece:</p>
                  <p className="text-sm text-primary">
                    {String(catchById.CatchDetails[1].value) !== "0" ? catchById.CatchDetails[2].value +
                      " " +
                      catchById.CatchDetails[2].unit.unitAcronyms: "-"}
                  </p>
                </div>
              </div>
            </div>
            <br />
            <FormSections
              title="Area Details"
              description="The following information displays data the water area and time data"
            />
  
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <p className="text-md">Water area code:</p>
                <p className="text-sm text-primary">{catchById.waterArea.waterAreaCode}</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-md">Water area name:</p>
                <p className="text-sm text-primary">{catchById.waterArea.waterAreaName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-md">Date:</p>
                <p className="text-sm text-primary">{catchById.createdAt.toLocaleString()}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
      <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <h1 className="text-[30px]">View Catch</h1>
      </CardHeader>
      <CardBody>
        <div className="space-y-1">
          <FormSections
            title={"Access denide!"}
            description={
              "You are not allowed to view this catch"
            }
          />
        </div>
      </CardBody>
    </Card>
  );

  
}
