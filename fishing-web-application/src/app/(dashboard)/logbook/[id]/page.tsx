import db from "@/lib/db";
import notFound from "./not-found";
import { Card, CardBody, CardHeader, Snippet } from "@nextui-org/react";
import { FormSections } from "@/components/form/form-section";
import { UserCard } from "@/components/auth/user-card";

interface LogbookShowPageProps {
  params: {
    id: string;
  };
}

export default async function LogbookShowPage(props: LogbookShowPageProps) {
  
  const logbook = await db.logbook.findUnique({
    where: {
      id: props.params.id,
    },
    select:{
        id:true,
        expiresDate:true,
        member:{
            select:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        firstName:true,
                        lastName: true,
                        image:true,
                        role: true
                    }
                },
                fisheryAuthority:{
                    select:{
                        id:true,
                        fisheryAuthorityName:true,
                        taxId:true,
                        address:{
                            select:{
                                streetName:true,
                                streetNumber:true,
                                floor:true,
                                door:true,
                                city:{
                                    select:{
                                        postalCode: true,
                                        cityName:true,
                                    }
                                }
                            }
                        },
                        waterArea:{
                            select:{
                                waterAreaCode:true,
                                waterAreaName:true,
                            }
                        }
                    }
                }
            }
        }
    }
  });
  

  if (!logbook) {
    return notFound();
  }

  console.log(logbook.member?.user.firstName)
  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Logbook Details</h1>
          <h3 className="text-primary">{logbook.member?.user.name+"'s logbook"}</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title="Member Details"
              description="The following information displays the common user data"
            />
          </div>
          <UserCard imgUrl={logbook.member?.user.image ? logbook.member?.user.image : ""} firstName={logbook.member?.user.firstName ? logbook.member?.user.firstName : ""} lastName={logbook.member?.user.lastName ?logbook.member?.user.lastName: ""} userRole={logbook.member?.user.role ? logbook.member?.user.role : ""}/>
          <FormSections
              title="Authority Details"
              description="The following information displays data the common fishery authority data"
            />
          <div className="w-full bg-default-50 rounded-xl shadow p-3 space-y-3 min-h-[200px] flex flex-col items-center justify-between">
            <Snippet symbol="Tax Identifier: " size="sm" fullWidth className=" overflow-auto bg-zinc-700">
              {logbook.id}
            </Snippet>
            <Snippet symbol="Water Area Code: " size="sm" fullWidth className=" overflow-auto bg-zinc-700">
              {logbook.member?.fisheryAuthority.fisheryAuthorityName}
            </Snippet>
            <Snippet symbol="Water Area Name: " size="sm" fullWidth className=" overflow-auto bg-zinc-700">
              {logbook.member?.fisheryAuthority.waterArea.waterAreaName}
            </Snippet>
          </div>
          <FormSections
              title="Latest Catches"
              description="The following information displays the latest catches"
            />
        </CardBody>
      </Card>
    </div>
  );
}
