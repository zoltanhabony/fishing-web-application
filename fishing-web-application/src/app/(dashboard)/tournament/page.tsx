"use server";
import { getAllPost } from "@/actions/db-actions/post-actions/get-all-post";
import { getAllTournament } from "@/actions/db-actions/tournament-actions/get-all-tournament";
import { auth } from "@/auth";
import { PostCard } from "@/components/card/post-card";
import { TournamentCard } from "@/components/card/tournament-card";
import { FormSections } from "@/components/form/form-section";
import { BottomPagination } from "@/components/pagination/bottom-pagination";
import { Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react";

export default async function TournamentPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    search?: string;
  };
}) {
  const session = await auth();

  const page = searchParams?.page || "1";
  const search = searchParams?.search || "";

  const tournamentList = await getAllTournament(page, search);

  const pages = Math.ceil(tournamentList.numberOfTournament / 12);

  const TournamentCardsPromise = tournamentList.tournament.map(
        async (tournament) =>
          await (
            <TournamentCard
              key={tournament.id}
              authorityName={tournament.fisheryAuthority.fisheryAuthorityName}
              isAuthor={await tournament.isAuthor}
              tournamentId={tournament.id}
              tournamentName={tournament.tournamentName}
              tournamentDescription={tournament.tournamentDescription}
              tournamentType={tournament.tournamentType ? tournament.tournamentType : "not specified"}
              numberOfParticipants={await tournament.numberOfParticipants}
              isFinished={tournament.isFinished}
            />
          )
      )

  const TournamentCards = await Promise.all(TournamentCardsPromise);


  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Tournaments</h1>
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

  return (
    <div className="p-5 h-full">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">Tournaments</h1>
        </CardHeader>
        <CardBody>
          <FormSections
            title={"Tournaments of associations"}
            description={
              "In the list below you can see the posts created by the associations. You can get important information from the posts."
            }
          />
          <br />
          {session.user.role === "OPERATOR" ? (
            <Button color="primary" href="/tournament/new" as={Link}>
              Create Tournament
            </Button>
          ) : (
            ""
          )}
        </CardBody>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-10 mt-16 px-3 ">
        {TournamentCards}
      </div>
      <br />
      <div className="w-full flex items-center justify-center">
        {pages !== 0 ? (
          <BottomPagination pages={pages} />
        ) : (
          <p>No tournament found</p>
        )}
      </div>
    </div>
  );
}
