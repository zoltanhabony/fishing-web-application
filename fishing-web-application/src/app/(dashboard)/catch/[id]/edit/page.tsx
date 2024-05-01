import { EditAuthorityForm } from "@/components/form/edit-authority-form";
import notFound from "../../../catch/[id]/not-found";
import db from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { EditMemberCatchForm } from "@/components/form/edit-member-catch-form";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { EditCatchForm } from "@/components/form/edit-catch-form";

interface AuthorityEditPageProps {
  params: {
    id: string;
  };
}
export default async function CatchEditPage(props: AuthorityEditPageProps) {
  const session = await auth()
  const id = props.params.id;

  const catchById = await db.catch.findUnique({
    where: {
      id: id,
    },
    select: {
        id:true,
      logbook: {
        select: {
          member: {
            select: {
              user: {
                select: {
                    id:true,
                  name: true,
                },
              },
            },
          },
        },
      },
      isInjured: true,
      isStored: true,
      waterArea: {
        select: {
          waterAreaName: true,
        },
      },
      fish: {
        select: {
            id:true,
          fishName: true,
        },
      },
      CatchDetails: {
        select:{
            id:true,
            value:true,
            unit:{
                select:{
                    id:true,
                    unitAcronyms:true
                }
            }
        }
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
          {session?.user.role === UserRole.USER ? <h1 className="text-[30px]">Edit Catch</h1> : <h1 className="text-[30px]">Edit User Catch</h1>}
          <h3 className="text-primary">
            {catchById.logbook.member?.user.name + "'s catch"}
          </h3>
          <h3 className="text-secondary text-sm">{"ID: " + catchById.id}</h3>
        </CardHeader>
        <CardBody>
          {session?.user.role === UserRole.USER ? <EditCatchForm data={catchById}/>: <EditMemberCatchForm data={catchById}/>}
          
        </CardBody>
      </Card>
    </div>
  );
}
