import { auth } from "@/auth";
import { ParticipantCard } from "@/components/card/participants-card";
import { ApplyTournamentForm } from "@/components/form/apply-tournament-form";
import { DeregisterTournamentForm } from "@/components/form/deregister-tournament-form";
import { EditAuthorityForm } from "@/components/form/edit-authority-form";
import { FormSections } from "@/components/form/form-section";

import db from "@/lib/db";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";

interface AuthorityEditPageProps {
  params: {
    id: string;
  };
}
export default async function TournamentViewPage(
  props: AuthorityEditPageProps
) {
  const id = props.params.id;

  const session = await auth();

  const member = await db.member.findFirst({
    where: {
      user: {
        email: session?.user.email,
      },
    },
  });

  const tournament = await db.tournament.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      tournamentName: true,
      tournamentDescription: true,
      tournamentType: true,
      maxParticipants: true,
      isFinished: true,
      fisheryAuthority: {
        select: {
          id: true,
          fisheryAuthorityName: true,
          address: {
            select: {
              city: {
                select: {
                  cityName: true,
                  postalCode: true,
                },
              },
              streetName: true,
              streetNumber: true,
            },
          },
        },
      },
      fish: {
        select: {
          fishName: true,
        },
      },
    },
  });

  const numberOfParticipants = await db.participant.aggregate({
    where: {
      tournamentId: id,
    },

    _count: {
      id: true,
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

  const map = await db.map.findFirst({
    where: {
      fisheryAuthorityId: tournament?.fisheryAuthority.id,
    },
    select: {
      id: true,
    },
  });

  const mapLink = `/map/${map?.id}`;

  const isParticipant = await db.participant.findFirst({
    where: {
      memberId: member?.id,
      tournamentId: tournament?.id,
    },
  });

  if (!id) {
    return <div>No content</div>;
  }

  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px] pb-3">Tournament Details</h1>
          <FormSections
            title="View Tournament"
            description="The following information provides details of the competition, if you are interested in the competition, register now!"
          />
        </CardHeader>
        <CardBody>
          <h2 className="text-primary font-bold pb-5">
            {tournament?.fisheryAuthority.fisheryAuthorityName +
              "'s tournament"}
          </h2>
          <div className="space-y-3">
            <h2 className="font-bold text-xl">{tournament?.tournamentName}</h2>
            <p className="text-md">{tournament?.tournamentDescription}</p>
            <div>
              <p>
                <span className="font-bold">Torunament type:</span>
                <span className="text-sm text-primary pl-3">
                  {tournament?.tournamentType}
                </span>
              </p>
            </div>
            <div>
              <p>
                <span className="font-bold">Fish type:</span>
                <span className="text-sm text-primary pl-3">
                  {tournament?.fish?.fishName
                    ? tournament?.fish?.fishName
                    : "not specified"}
                </span>
              </p>
            </div>
            <div>
              <p>
                <span className="font-bold">Participants:</span>
                <span className="text-sm text-primary pl-3">
                  {numberOfParticipants._count.id}
                </span>
                <span className="text-sm">
                  {" / " + tournament?.maxParticipants}
                </span>
              </p>
            </div>
          </div>
          <br />
          <FormSections
            title="Location Details"
            description="The information below shows the address of the organising association and a map of the water area, if available"
          />
          <div>
            <p>
              <span className="font-bold">Address:</span>
              <span className="text-sm text-primary pl-3">
                {tournament?.fisheryAuthority.address.city.postalCode +
                  " " +
                  tournament?.fisheryAuthority.address.city.cityName +
                  ", " +
                  tournament?.fisheryAuthority.address.streetName +
                  " " +
                  tournament?.fisheryAuthority.address.streetNumber}
              </span>
            </p>
          </div>
          <div>
            <p>
              <span className="font-bold">Map:</span>
              <span className="text-sm text-primary pl-3">
                {map?.id ? (
                  <Link href={mapLink} className="text-sm text-secondary">
                    go to the map
                  </Link>
                ) : (
                  "map not found"
                )}
              </span>
            </p>
          </div>
          {member && !tournament?.isFinished ? (
            isParticipant ? (
              <DeregisterTournamentForm id={String(tournament?.id)} />
            ) : (
              <ApplyTournamentForm id={String(tournament?.id)} />
            )
          ) : (
            ""
          )}
          <br />
          {tournament?.isFinished ? (
            <div>
              <FormSections
                title="Final result of the competition"
                description="The list below shows the competitors in rank order!"
              />
              <br />
              <div className="space-y-3">
                {participants.map((p, index) => (
                  <ParticipantCard
                    key={p.id}
                    index={index + 1}
                    item={{
                      id: p.id,
                      member: {
                        id: p.member.id,
                        user: {
                          image: p.member.user.image,
                          name: p.member.user.name,
                          firstName: p.member.user.firstName,
                          lastName: p.member.user.lastName,
                          email: p.member.user.email,
                        },
                      },
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </CardBody>
      </Card>
    </div>
  );
}
