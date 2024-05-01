import { EditAuthorityForm } from "@/components/form/edit-authority-form";
import notFound from "../../../catch/[id]/not-found";
import db from "@/lib/db";
import { Card, CardBody, CardHeader} from "@nextui-org/react";
import { EditMemberTabs } from "@/components/edit-member-tabs";

interface AuthorityEditPageProps {
  params: {
    id: string;
  };
}
export default async function AuthorityEditPage(props: AuthorityEditPageProps) {
  const id = props.params.id;

  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      access: true,
      role: true,
    },
  });

  if (!user) {
    return notFound();
  }

  const logbook = await db.logbook.findFirst({
    where: {
      member: {
        user: {
          id: id,
        },
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

  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Member</h1>
          <h2 className="text-primary font-bold">{user.name}</h2>
        </CardHeader>
        <CardBody>
          <EditMemberTabs user={user} logbook={logbook}/>
        </CardBody>
      </Card>
    </div>
  );
}

