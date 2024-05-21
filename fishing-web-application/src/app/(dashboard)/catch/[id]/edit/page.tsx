import { EditAuthorityForm } from "@/components/form/edit-authority-form";
import notFound from "../../../catch/[id]/not-found";
import db from "@/lib/db";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { EditMemberCatchForm } from "@/components/form/edit-member-catch-form";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { EditCatchForm } from "@/components/form/edit-catch-form";
import { BackIcon } from "@/icons/back-icon";
import { FormSections } from "@/components/form/form-section";

interface AuthorityEditPageProps {
  params: {
    id: string;
  };
}
export default async function CatchEditPage(props: AuthorityEditPageProps) {
  const session = await auth()
  const id = props.params.id;

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Catch</h1>
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

  const access = await db.access.findFirst({
    where:{
      user:{
        email: session?.user.email
      }
    }
  })

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
  
  if(session.user.role === "USER" && (!isOwnFish || !access?.accessToLogbook || !access.accessToFishing || catchById.isStored === true)){
   return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
    <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
      <h1 className="text-[30px]">Edit Catch</h1>
    </CardHeader>
    <CardBody>
      <div className="space-y-1">
        <FormSections
          title={"Access denide!"}
          description={
            "You are not allowed to edit this catch"
          }
        />
      </div>
    </CardBody>
  </Card>
   )
  }

  if(isOwnFish && access?.accessToLogbook && access.accessToFishing || (session.user.role === "OPERATOR" && isInWaterArea) || (isInWaterArea && !isOwnFish && session?.user.role === "INSPECTOR" && access?.accessToCatches)){
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

  return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
      <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <h1 className="text-[30px]">Edit Catch</h1>
      </CardHeader>
      <CardBody>
        <div className="space-y-1">
          <FormSections
            title={"Access denide!"}
            description={
              "You are not allowed to edit this catch"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}
