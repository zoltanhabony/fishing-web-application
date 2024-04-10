import db from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { FormSections } from "@/components/form/form-section";
import notFound from "../not-found";
import { EditLogbookForm } from "@/components/form/edit-logbook-form";

interface LogbookEditPageProps {
  params: {
    id: string;
  };
}
export default async function AuthorityEditPage(props: LogbookEditPageProps) {
  const id = props.params.id;

  const logbook = await db.logbook.findUnique({
    where: {
      id: id,
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

  if (!logbook) {
    return notFound();
  }
  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Authority</h1>
          <h2 className="text-primary font-bold">{logbook.member?.user.name+"'s logbook"}</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title="Edit Authority Data"
              description="The following fields are required. These data will be necessary to identify the associations and to create the digital catch logbook"
            />
          </div>
          <EditLogbookForm data={logbook} />
        </CardBody>
      </Card>
    </div>
  );
}
