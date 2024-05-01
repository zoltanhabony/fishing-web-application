import db from "@/lib/db";
import notFound from "./not-found";
import { Card, CardBody, CardHeader, Snippet } from "@nextui-org/react";
import { FormSections } from "@/components/form/form-section";
import { FishAvatar } from "@/components/card/fish-card";

interface LogbookShowPageProps {
  params: {
    id: string;
  };
}

export default async function MemberShowPage(props: LogbookShowPageProps) {
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

  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
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
            <FormSections
              title="Fish Data"
              description="The following information displays the fish data"
            />
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
