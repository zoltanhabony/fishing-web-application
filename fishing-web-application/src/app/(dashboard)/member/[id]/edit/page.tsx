import { EditAuthorityForm } from "@/components/form/edit-authority-form";
import notFound from "../../../catch/[id]/not-found";
import db from "@/lib/db";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { EditMemberTabs } from "@/components/edit-member-tabs";
import { BackIcon } from "@/icons/back-icon";
import { FormSections } from "@/components/form/form-section";
import { auth } from "@/auth";

interface AuthorityEditPageProps {
  params: {
    id: string;
  };
}
export default async function AuthorityEditPage(props: AuthorityEditPageProps) {
  const id = props.params.id;
  const session = await auth()

  if(!session){
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Member</h1>
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
    where: {
      user: {
        email: session.user.email
      }
    }
  })

  const member = await db.member.findUnique({
    where: {
      id: id,
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
      fisheryAuthority:{
        select:{
          fisheryAuthorityName:true
        }
      }
    },
  });

  if (!member) {
    return notFound();
  }

  const isMember = await db.member.findFirst({
    where: {
        user:{
            email: session?.user.email
        },
        fisheryAuthority: {
          fisheryAuthorityName: member?.fisheryAuthority ? member?.fisheryAuthority.fisheryAuthorityName  : ""
        }
    }
  })


  if(!isMember){
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Logbook</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Access denied!"}
              description={
                "You are not allowed to edit this member"
              }
            />
          </div>
        </CardBody>
      </Card>
    );
  }


  if(member.user.role === "OPERATOR" || (member.user.role === session?.user.role)){
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Member</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Access denied!"}
              description={
                "You are not allowed to edit this member"
              }
            />
          </div>
        </CardBody>
      </Card>
    );
  }

  const logbook = await db.logbook.findFirst({
    where: {
      member: {
        id: id,
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
              name: true,
            },
          },
          fisheryAuthority: {
            select: {
              id: true,
              fisheryAuthorityName: true,
            },
          },
        },
      },
    },
  });

  if(isMember && session.user.role === "OPERATOR" || (session.user.role === "INSPECTOR" && Boolean(access?.accessToAuthority))){
    return (
      <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <Link href={"/member"} className="pb-3 text-sm flex">
              <BackIcon />
              <span className="pl-3 text-primary">{"back to list of members"}</span>
            </Link>
            <h1 className="text-[30px]">Edit Member</h1>
            <h2 className="text-primary font-bold">{member.user.name}</h2>
          </CardHeader>
          <CardBody>
            <EditMemberTabs member={member} logbook={logbook} />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
      <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <h1 className="text-[30px]">Member</h1>
      </CardHeader>
      <CardBody>
        <div className="space-y-1">
          <FormSections
            title={"Access denied!"}
            description={
              "You are not allowed to edit this member"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
  
}
