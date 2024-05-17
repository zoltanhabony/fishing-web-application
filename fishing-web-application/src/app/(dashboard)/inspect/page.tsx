import { auth } from "@/auth";
import { UserAvatar } from "@/components/card/user-card";
import { FormSections } from "@/components/form/form-section";
import { InspectForm } from "@/components/form/inspect-form";
import db from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export const dynamic = "force-dynamic";

export default async function InspectPage({
  searchParams,
}: {
  searchParams?: {
    name?: string;
  };
}) {
  const session = await auth();
  const name = searchParams?.name || "";

  const now = new Date()
  const tomorrow: Date = new Date(now.getTime() + (24 * 60 * 60 * 1000));
  
  const nowYear = now.getFullYear().toString()
  const nowMonth = (now.getUTCMonth()+1).toString()
  const nowDay = now.getDate().toString()

  const tomYear = tomorrow.getFullYear().toString()
  const tomMonth = (tomorrow.getUTCMonth()+1).toString()
  const tomDay = tomorrow.getDate().toString()

  const dateStart = nowMonth.length === 1 ? nowYear + "-0" + nowMonth + "-" + nowDay :  nowYear + "-" + nowMonth + "-" + nowDay
  const dateEnd = tomMonth.length === 1 ? tomYear + "-0" + tomMonth  + "-" + tomDay :  tomYear + "-" + tomMonth + "-" + tomDay + 1

  console.log("sartDate: " + dateStart + ", endDate: " + dateEnd)

  const access = await db.access.findFirst({
    where: {
      user: {
        email: session?.user.email,
      },
    },
  });

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Inspect</h1>
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

  const user = await db.user.findUnique({
    where: {
      name: name,
    },
  });

  console.log(user?.name);

  const member = await db.member.findFirst({
    where: {
      userId: String(user?.id),
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          access: true,
          role: true,
        },
      },
      fisheryAuthority: {
        select: {
          fisheryAuthorityName: true,
        },
      },
    },
  });

  console.log(member);

  const logbook = await db.logbook.findFirst({
    where: {
      member: {
        id: String(member?.id),
      },
    },
    select: {
      id: true,
      expiresDate: true,
      member: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              firstName: true,
              lastName: true,
              image: true,
              role: true,
              createdAt: true,
              IsFishing: {
                select: {
                  date: true,
                },
              },
            },
          },
          fisheryAuthority: {
            select: {
              id: true,
              fisheryAuthorityName: true,
              waterArea: {
                select: {
                  waterAreaCode: true,
                  waterAreaName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const catchById = await db.catch.findMany({
    where: {
      logbookId: String(logbook?.id),
      isStored: true,
      createdAt: {
        lte: new Date(dateEnd),
        gte: new Date(dateStart)
      }
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

  console.log(catchById)

  const currentDate = new Date();
  const isFishing =
    logbook?.member?.user.IsFishing.length !== 0
      ? logbook?.member?.user.IsFishing[0].date.toLocaleDateString() ===
        currentDate.toLocaleDateString()
      : false;

  if (
    session.user.role === "OPERATOR" ||
    (session.user.role === "INSPECTOR" && access?.accessToInspect)
  ) {
    if (user && member && logbook) {
      return (
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Inspect</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title={"Check the anglers!"}
                description={
                  "Check anglers' current activities to ensure that they are regular and check that the data is authentic and consistent!"
                }
              />
              <InspectForm />
              <div className="space-y-3 pt-3">
                <FormSections
                  title="User Data"
                  description="The following information displays the main user data"
                />
                <div className="flex items-center space-x-2">
                  <p className="text-sm">Status:</p>
                  {isFishing ? (
                    <p className="text-sm text-success">Currently Fishing</p>
                  ) : (
                    <p className="text-sm text-default">
                      Currently Not Fishing
                    </p>
                  )}
                </div>
                <UserAvatar
                  image={logbook?.member?.user.image}
                  username={logbook?.member?.user.name}
                  email={logbook?.member?.user.email}
                  firstName={logbook?.member?.user.firstName}
                  lastName={member.user.lastName}
                />
                <FormSections
                  title="Logbook Data"
                  description="The following information displays the main logbook data"
                />

                <div className="flex items-center space-x-2">
                  <p className="text-sm">Logbook ID:</p>
                  <p className="text-sm text-primary">{logbook?.id}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="text-sm">Water Area Code:</p>
                  <p className="text-sm text-primary">
                    {logbook?.member?.fisheryAuthority.waterArea.waterAreaCode}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="text-sm">Water Area Name:</p>
                  <p className="text-sm text-primary">
                    {logbook?.member?.fisheryAuthority.waterArea.waterAreaName}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="text-sm">Authority Name:</p>
                  <p className="text-sm text-primary">
                    {logbook?.member?.fisheryAuthority.fisheryAuthorityName}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="text-sm">Logbook Expires Date:</p>
                  <p className="text-sm text-primary">
                    {logbook?.expiresDate.toLocaleDateString()}
                  </p>
                </div>

                <br />

                <FormSections
                  title="Saved catch"
                  description="The saved fish that will be taken away"
                />

                <div className="space-y-3">
                  <div className="space-y-2">
                    {catchById ? (
                      catchById.map((fish) => (
                        <div key={fish.id}>
                          <div key="" className="flex items-center space-x-2">
                            <p className="text-md">Fish type:</p>
                            <p className="text-sm text-primary">
                              {fish.fish.fishName}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <p className="text-md">Fish code:</p>
                            <p className="text-sm text-primary">
                              {fish.fish.fishCode !== null
                                ? fish.fish.fishCode
                                : "-"}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <p className="text-md">Weight:</p>
                            <p className="text-sm text-primary">
                              {String(fish.CatchDetails[0].value) !== "0"
                                ? fish.CatchDetails[0].value +
                                  " " +
                                  fish.CatchDetails[0].unit.unitAcronyms
                                : "-"}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <p className="text-md">Length:</p>
                            <p className="text-sm text-primary">
                              {String(fish.CatchDetails[1].value) !== "0"
                                ? fish.CatchDetails[1].value +
                                  " " +
                                  fish.CatchDetails[1].unit.unitAcronyms
                                : "-"}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <p className="text-md">Piece:</p>
                            <p className="text-sm text-primary">
                              {String(fish.CatchDetails[1].value) !== "0"
                                ? fish.CatchDetails[2].value +
                                  " " +
                                  fish.CatchDetails[2].unit.unitAcronyms
                                : "-"}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      );
    }
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Inspect</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Check the anglers!"}
              description={
                "Check anglers' current activities to ensure that they are regular and check that the data is authentic and consistent!"
              }
            />
            <InspectForm />
            <div className="pt-5"><p className="text-sm text-default">No user or logbook found</p></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
      <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <h1 className="text-[30px]">Inspect</h1>
      </CardHeader>
      <CardBody>
        <div className="space-y-1">
          <FormSections
            title={"Access denide!"}
            description={"You have no right to control anglers!"}
          />
        </div>
      </CardBody>
    </Card>
  );
}
