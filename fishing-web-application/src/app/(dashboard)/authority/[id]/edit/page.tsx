import { EditAuthorityForm } from "@/components/edit-authority-form";
import notFound from "../not-found";
import db from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { FormSections } from "@/components/form-section";

interface AuthorityEditPageProps {
  params: {
    id: string;
  };
}
export default async function AuthorityEditPage(props: AuthorityEditPageProps) {
  const id = props.params.id;

  const authority = await db.fisheryAuthority.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      fisheryAuthorityName: true,
      waterArea: {
        select: {
          waterAreaName: true,
        },
      },
      taxId: true,
      address: {
        select: {
          city: {
            select: {
              cityName: true,
            },
          },
          streetName: true,
          streetNumber: true,
          floor: true,
          door: true,
        },
      },
    },
  });

  if (!authority) {
    return notFound();
  }
  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Authority</h1>
          <h2 className="text-primary font-bold">
            {authority.fisheryAuthorityName}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title="Edit Authority Data"
              description="The following fields are required. These data will be necessary to identify the associations and to create the digital catch logbook"
            />
          </div>
          <EditAuthorityForm data={authority} />
        </CardBody>
      </Card>
    </div>
  );
}
