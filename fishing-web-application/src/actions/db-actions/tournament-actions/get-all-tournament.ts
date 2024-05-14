"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function getAllTournament(page: string, search: string) {
  const currentPage = page ? page : 1;
  const currentRow = 12;
  const currentSearch = search ? search : "";

  const session = await auth();

  const skip = +currentPage * +currentRow - +currentRow;
  const take = +currentRow;

  type torunament = {
    fisheryAuthority: {
      fisheryAuthorityName: string;
    };
    isFinished:boolean
    isAuthor: Promise<boolean>;
    id: string;
    tournamentName: string;
    tournamentDescription: string;
    tournamentType: string | null;
    numberOfParticipants: Promise<number>;
  }[];

  const emptyTournament: torunament = [];

  try {
    const xdb = await db.$extends({
      result: {
        tournament: {
          isAuthor: {
            needs: { memberId: true, fisheryAuthorityId: true },
            async compute(post) {
              
              const currentMember = await db.tournament.findFirst({
                where: {
                  fisheryAuthorityId: post.fisheryAuthorityId,
                  member: {
                    user: {
                      role: UserRole.OPERATOR,
                      email: session?.user.email,
                    },
                  },
                },
              });
              
              console.log(currentMember)
              return post.memberId === currentMember?.memberId;
            },
          },
          numberOfParticipants: {
            needs: { id: true },
            async compute(part) {
              const participants = await db.participant.aggregate({
                where: { tournamentId: part.id },
                _count: {
                  id: true,
                },
              });
              return participants._count.id;
            },
          },
        },
      },
    });

    const tournament: torunament = await xdb.tournament.findMany({
      where: {
        fisheryAuthority: {
          fisheryAuthorityName: {
            contains: currentSearch,
          },
        },
      },

      select: {
        isFinished:true,
        id: true,
        isAuthor: true,
        numberOfParticipants: true,
        tournamentName: true,
        tournamentDescription: true,
        tournamentType: true,
        fisheryAuthority: {
          select: {
            fisheryAuthorityName: true,
          },
        },
      },
      skip: skip,
      take: take,
    });

    const numberOfTournament = await db.tournament.aggregate({
      where: {
        fisheryAuthority: {
          fisheryAuthorityName: {
            contains: currentSearch,
          },
        },
      },
      _count: {
        id: true,
      },
    });

    return { tournament: tournament, numberOfTournament: numberOfTournament._count.id };
  } catch (e) {
    return { tournament: emptyTournament, numberOfTournament: 0 };
  }
}
