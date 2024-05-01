"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

type mebership = {
  id: string;
  userId: string;
  fisheryAuthorityId: string;
  logbookId: string | null;
}[];

export async function getMembers(
  page: string,
  row: string,
  search: string,
  sort: string,
  direction: string
) {
  const currentPage = page ? page : 1;
  const currentRow = row ? row : 5;
  const currentSearch = search ? search : "";

  const currentSort = sort as Prisma.MemberOrderByRelevanceFieldEnum;

  let currentOrder = "" as Prisma.SortOrder;

  switch (direction) {
    case "ascending":
      currentOrder = "asc";
      break;
    case "descending":
      currentOrder = "desc";
    default:
      break;
  }

  const skip = +currentPage * +currentRow - +currentRow;
  const take = +currentRow;

  const session = await auth();

  const memberships = await db.member.findMany({
    where: {
      user: {
        email: session?.user.email,
      },
    },
    select: {
      fisheryAuthorityId: true,
    },
  });

  const membersList: mebership = [];

  for (let x in memberships) {
    const lb = await db.member.findMany({
      where: {
        NOT: {
          user: {
            email: session?.user.email,
          },
        },
        fisheryAuthorityId: memberships[x].fisheryAuthorityId,
      },
    });
    membersList.push(...lb);
  }

  if(currentSort in Prisma.FisheryAuthorityOrderByRelevanceFieldEnum && currentOrder in Prisma.SortOrder){
    const members = await db.member.findMany({
      where:{
        user: {
          name: {
            contains: currentSearch,
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            image: true,
            role: true,
          },
        },
        logBook: {
          select: {
            id: true,
            expiresDate: true,
          },
        },
        fisheryAuthority: {
          select: {
            id: true,
            fisheryAuthorityName: true,
          },
        },
      },
      orderBy:{
        [currentSort]:currentOrder
      },
      skip: skip,
      take: take,
    })

    const numberOfMembers = await db.member.aggregate({
      where: {
        OR: membersList,
        user: {
          name: {
            contains: currentSearch,
          },
        },
      },
      orderBy: {
        [currentSort]: currentOrder,
      },
      _count: {
        id: true,
      },
    });

    return { members: members, numberOfMembers: numberOfMembers };
  }

  const members = await db.member.findMany({
    where: {
      OR: membersList,
      user: {
        name: {
          contains: currentSearch,
        },
      },
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          image: true,
          role: true,
        },
      },
      logBook: {
        select: {
          id: true,
          expiresDate: true,
        },
      },
      fisheryAuthority: {
        select: {
          id: true,
          fisheryAuthorityName: true,
        },
      },
    },
    skip: skip,
    take: take,
  });

  const numberOfMembers = await db.member.aggregate({
    where: {
      OR: membersList,
      user: {
        name: {
          contains: currentSearch,
        },
      },
    },
    _count: {
      id: true,
    },
  });
  return { members: members, numberOfMembers: numberOfMembers };


}
