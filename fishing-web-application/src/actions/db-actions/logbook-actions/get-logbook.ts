"use server";

import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getLogbooks(
  page: string,
  row: string,
  search: string,
  sort: string,
  direction: string
) {
  const currentPage = page ? page : 1;
  const currentRow = row ? row : 5;
  const currentSearch = search ? search : "";

  const currentSort = sort as Prisma.LogbookOrderByRelevanceFieldEnum;

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

  if (
    currentSort in Prisma.LogbookOrderByRelevanceFieldEnum &&
    currentOrder in Prisma.SortOrder
  ) {
    const logbooks = await db.logbook.findMany({
      where: {
        member: {
          user: {
            name: {
                contains: currentSearch
            }
          },
        },
      },
      select: {
        id: true,
        member: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
            fisheryAuthority: {
                select:{
                    fisheryAuthorityName:true
                }
            }
          },
        },
        expiresDate:true
      },
      orderBy: {
        [currentSort]: currentOrder,
      },
      skip: skip,
      take: take,
    });

    const numberOfLogbooks = await db.logbook.aggregate({
        where: {
            member: {
              user: {
                name: {
                    contains: currentSearch
                }
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

    return { logbooks: logbooks, numberOfLogbooks: numberOfLogbooks };
  }

  const logbooks = await db.logbook.findMany({
    where: {
      member: {
        user: {
            name: {
                contains: currentSearch
            },
        },
      },
    },

    select: {
        id: true,
        member: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
            fisheryAuthority: {
                select:{
                    fisheryAuthorityName:true
                }
            }
          },
        },
        expiresDate:true
      },

    skip: skip,
    take: take,
  });

  const numberOfLogbooks = await db.logbook.aggregate({
    where: {
        member: {
          user: {
            name: {
                contains: currentSearch
            },
          },
        },
      },
    _count: {
      id: true,
    },
  });
  return { logbooks: logbooks, numberOfLogbooks: numberOfLogbooks };
}
