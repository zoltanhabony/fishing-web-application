"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { Prisma, UserRole } from "@prisma/client";


export async function getfisheryAuthorities(
  page: string,
  row: string,
  search: string,
  sort: string,
  direction: string
) {
  const currentPage = page ? page : 1;
  const currentRow = row ? row : 5;
  const currentSearch = search ? search : "";

  const currentSort = sort as Prisma.FisheryAuthorityOrderByRelevanceFieldEnum;

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


  if (
    currentSort in Prisma.FisheryAuthorityOrderByRelevanceFieldEnum &&
    currentOrder in Prisma.SortOrder
  ) {
    const authorities = await db.member.findMany({
      where: {
        user: {
          email: session?.user.email,
          role: UserRole.OPERATOR || UserRole.INSPECTOR
        },

        fisheryAuthority: {
          fisheryAuthorityName: {
            contains: currentSearch
          },
        },
      },
      select: {
        id: true,
        fisheryAuthority: {
          select: {
            id: true,
            fisheryAuthorityName: true,
            taxId: true,
            address: {
              select: {
                streetName: true,
                streetNumber: true,
                floor: true,
                door: true,
                city: {
                  select: {
                    cityName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        [currentSort]: currentOrder,
      },
      skip: skip,
      take: take,
    });

    const numberOfAuthorities = await db.member.aggregate({
      where: {
        user: {
          email: session?.user.email,
          role: UserRole.OPERATOR || UserRole.INSPECTOR
        },

        fisheryAuthority: {
          fisheryAuthorityName: {
            contains: currentSearch
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

    return {
      authorities: authorities,
      numberOfAuthorities: numberOfAuthorities,
    };
  }

  const authorities = await db.member.findMany({
    where: {
      user: {
        email: session?.user.email,
        role: UserRole.OPERATOR || UserRole.INSPECTOR
      },

      fisheryAuthority: {
        fisheryAuthorityName: {
          contains: currentSearch
        },
      },
    },
    select: {
      id: true,
      fisheryAuthority: {
        select: {
          id: true,
          fisheryAuthorityName: true,
          taxId: true,
          address: {
            select: {
              streetName: true,
              streetNumber: true,
              floor: true,
              door: true,
              city: {
                select: {
                  cityName: true,
                },
              },
            },
          },
        },
      },
    },
    skip: skip,
    take: take,
  });

  const numberOfAuthorities = await db.member.aggregate({
    where: {
      user: {
        email: session?.user.email,
        role: UserRole.OPERATOR || UserRole.INSPECTOR
      },

      fisheryAuthority: {
        fisheryAuthorityName: {
          contains: currentSearch
        },
      },
    },
    _count: {
      id: true,
    },
  });
  return { authorities: authorities, numberOfAuthorities: numberOfAuthorities };
}
