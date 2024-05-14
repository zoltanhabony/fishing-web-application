import { auth } from "@/auth";
import { ReorderParticipantCards } from "@/components/card/reorder-participant-cards";
import { EditTournamentForm } from "@/components/form/edit-tournament-form";
import { FormSections } from "@/components/form/form-section";
import db from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

interface AuthorityEditPageProps {
  params: {
    id: string;
  };
}

export default async function EditLogbookPage(props: AuthorityEditPageProps) {
  const session = await auth();

  const tournament = await db.tournament.findUnique({
    where: {
      id: props.params.id,
    },
    select: {
      id: true,
      tournamentName: true,
      tournamentDescription: true,
      tournamentType: true,
      startDate: true,
      deadline: true,
      maxParticipants: true,
      isFinished: true,
      fish: {
        select: {
          id: true,
        },
      },
      fisheryAuthority: {
        select: {
          fisheryAuthorityName: true,
        },
      },
    },
  });

  const participants = await db.participant.findMany({
    where: {
      tournamentId: tournament?.id,
    },
    select: {
      id: true,
      member: {
        select: {
          id: true,
          user: {
            select: {
              image: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      rank: "asc",
    },
  });

  if (!tournament) {
    return <div>No content</div>;
  }

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Tournament</h1>
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

  if (session.user.role !== "OPERATOR") {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Tournament</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"Authorization failed!"}
              description={"You are not allowed to edit a competition!"}
            />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Tournament</h1>
          <h2 className="text-primary font-bold text-sm">{tournament?.id}</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title="Change tournament details"
              description="The following fields are mandatory. This information is used to determine the information required for a competition."
            />
            <EditTournamentForm
              props={{
                fisheryAuthorityName:
                  tournament.fisheryAuthority.fisheryAuthorityName,
                tournamentName: tournament.tournamentName,
                tournamentType: String(tournament.tournamentType),
                tournamentDescription: tournament.tournamentDescription,
                maxParticipants: tournament.maxParticipants,
                startDate: tournament.startDate,
                deadline: tournament.deadline,
                fishId:
                  tournament.fish?.id === "" ? tournament.fish?.id : undefined,
                id: tournament.id,
                isFinished: tournament.isFinished,
              }}
            />
            <br />
            <FormSections
              title="Modify rankings"
              description="In the following list, you can change places and delete participants."
            />
            <ReorderParticipantCards
              items={participants}
              tournamentId={tournament.id}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
