import { EditAuthorityForm } from "@/components/form/edit-authority-form";
import notFound from "./not-found";
import db from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { EditMemberTabs } from "@/components/edit-member-tabs";
import { FormSections } from "@/components/form/form-section";
import { UserAvatar } from "@/components/card/user-card";

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

  const currentDate = new Date().toLocaleDateString();

  const isFishing =
    logbook?.member?.user.IsFishing[0].date.toLocaleDateString() ===
    currentDate;

  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Member Details</h1>
          <h2 className="text-primary font-bold">{user.name}</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
          <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm">Status:</p>
                {isFishing ? <p className="text-sm text-success">
                Currently Fishing
                </p> : <p className="text-sm text-default">
                Currently Not Fishing
                </p>}
              </div>
              </div>
            <FormSections
              title="User Data"
              description="The following information displays the main user data"
            />
            <UserAvatar
              image={logbook?.member?.user.image}
              username={logbook?.member?.user.name}
              email={logbook?.member?.user.email}
              firstName={logbook?.member?.user.firstName}
              lastName={user.lastName}
            />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm">Email:</p>
                <p className="text-sm text-primary">
                  {logbook?.member?.user.email}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm">Role:</p>
                <p className="text-sm text-primary">
                  {logbook?.member?.user.role}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm">Date of registration</p>
                <p className="text-sm text-primary">
                  {logbook?.member?.user.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <br />
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
              title="Last Fishing"
              description="The latest fishing"
            />
             <div className="flex items-center space-x-2">
              <p className="text-sm">Date:</p>
              <p className="text-sm text-primary">
                {logbook?.member?.user.IsFishing[0].date.toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
