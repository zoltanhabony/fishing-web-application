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

type catchesList = {
  id: string;
  logbookId: string;
  waterAreaId: string;
  fishId: string;
  createdAt: Date;
  isInjured: boolean | null;
  detailId: string;
  isStored: boolean;
}[];


export async function getAllCatches(
  page: string,
  row: string,
  search: string,
  sort: string,
  direction: string,
  filter: "all" | "member",
  isSaved: "true" | "false" | "undefined"
) {
  const currentPage = page ? page : 1;
  const currentRow = row ? row : 5;
  const currentSearch = search ? search : "";

  const currentSort = sort as Prisma.CatchOrderByRelevanceFieldEnum;

  let currentOrder = "" as Prisma.SortOrder;
  let currentIsSaved: boolean | undefined = undefined;
  let currentFilter = "all";

  switch (direction) {
    case "ascending":
      currentOrder = "asc";
      break;
    case "descending":
      currentOrder = "desc";
      break;
    default:
      break;
  }

  switch (isSaved) {
    case "true":
      currentIsSaved = true;
      break;
    case "false":
      currentIsSaved = undefined;
      break;
    default:
      currentIsSaved = undefined;
      break;
  }

  switch (filter) {
    case "all":
      currentFilter = "all";
      break;
    case "member":
      currentFilter = "member";
      break;
    default:
      currentFilter = "all";
      break;
  }

  const skip = +currentPage * +currentRow - +currentRow;
  const take = +currentRow;

  const session = await auth();

  //Select member by user authorities
  
  //Memberships between authority (Where)
  const memberships = await db.member.findMany({
    where: {
      user: {
        email: session?.user.email,
      },
    },
    select: {
      fisheryAuthority: {
        select: {
          id: true,
          waterAreaId: true,
        },
      },
    },
  });

  //Members list (Whose)
  const membersList: mebership = [];
  for (let x in memberships) {
    const lb = await db.member.findMany({
      where: {
        NOT: {
          user: {
            email: session?.user.email,
          },
        },
        fisheryAuthorityId: memberships[x].fisheryAuthority.id,
      },
    });
    membersList.push(...lb);
  }

  //Member

  if (currentFilter === "member") {
    //Catches by members
    const catchesList: catchesList = [];

    for (let x in memberships) {
      const c = await db.catch.findMany({
        where: {
          logbook: {
            member: {
              OR: membersList,
              user: {
                name: {
                  contains: currentSearch,
                },
              },
            },
          },
          isStored: currentIsSaved,
          waterAreaId: memberships[x].fisheryAuthority.waterAreaId,
        },
      });
      catchesList.push(...c);
    }

    // Only Member sorted
    if (
      currentSort in Prisma.CatchOrderByRelevanceFieldEnum &&
      currentOrder in Prisma.SortOrder
    ) {
      const catches = await db.catch.findMany({
        where: {
          OR: catchesList,
        },
        select: {
          id: true,
          waterArea: {
            select: {
              waterAreaCode: true,
              waterAreaName: true,
            },
          },
          logbook: {
            select: {
              member: {
                select: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          createdAt: true,
          isInjured: true,
          isStored: true,
          fish: {
            select: {
              id: true,
              fishCode: true,
              fishName: true,
              fishImageURL: true,
            },
          },
          CatchDetails: {
            select: {
              value: true,
              unit: {
                select: {
                  unitAcronyms: true,
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


      const numberOfCatches = await db.catch.aggregate({
        where: {
          OR: catchesList,
        },
        orderBy: {
          [currentSort]: currentOrder,
        },
        _count: {
          id: true,
        },
      });
      return { catches: catches, numberOfCatches: numberOfCatches };
    }

    // Only Member not sorted
    const catches = await db.catch.findMany({
      where: {
        OR: catchesList,
      },
      select: {
        id: true,
        logbook: {
          select: {
            member: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        waterArea: {
          select: {
            waterAreaCode: true,
            waterAreaName: true,
          },
        },
        createdAt: true,
        isInjured: true,
        isStored: true,
        fish: {
          select: {
            id: true,
            fishName: true,
            fishCode: true,
            fishImageURL: true,
          },
        },
        CatchDetails: {
          select: {
            value: true,
            unit: {
              select: {
                unitAcronyms: true,
              },
            },
          },
        },
      },
      skip: skip,
      take: take,
    });

    const numberOfCatches = await db.catch.aggregate({
      where: {
        OR: catchesList,
      },
      _count: {
        id: true,
      },
    });


    return { catches: catches, numberOfCatches: numberOfCatches };
  }

  /*Itten van a nem mmber */

  const catchList:  catchesList = [];


  //All catches sorted
  if (
    currentSort in Prisma.CatchOrderByRelevanceFieldEnum &&
    currentOrder in Prisma.SortOrder
  ) {
    //Members catches
    for (let x in memberships) {
      const c = await db.catch.findMany({
        where: {
          logbook: {
            member: {
              user: {
                name: {
                  contains: currentSearch,
                },
              },
            },
          },
          isStored: currentIsSaved,
          waterAreaId: memberships[x].fisheryAuthority.waterAreaId,
        },
        orderBy: {
          [currentSort]: currentOrder,
        },
        skip: skip,
        take: take,
      });
      catchList.push(...c);
    }
    
    
    const numberOfCatches = await db.catch.aggregate({
      where: {
        OR: catchList
      },
      orderBy: {
        [currentSort]: currentOrder,
      },
      _count: {
        id: true,
      },
    });
    
    
      const catches = await db.catch.findMany({
        where:{
          OR:catchList
        },
        select: {
          id: true,
          waterArea: {
            select: {
              waterAreaCode: true,
              waterAreaName: true,
            },
          },
          logbook: {
            select: {
              member: {
                select: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          createdAt: true,
          isInjured: true,
          isStored: true,
          fish: {
            select: {
              id: true,
              fishCode: true,
              fishName: true,
              fishImageURL: true,
            },
          },
          CatchDetails: {
            select: {
              value: true,
              unit: {
                select: {
                  unitAcronyms: true,
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
      })
    
      return { catches: catches, numberOfCatches: numberOfCatches };
  }


 //All catches  not sorted
 for (let x in memberships) {
  
  const c = await db.catch.findMany({
    where: {
      logbook:{
        member:{
          user:{
            name: {
              contains: currentSearch,
            }
          }
        }
      },
      isStored: currentIsSaved,
      waterAreaId: memberships[x].fisheryAuthority.waterAreaId,
    },
  });
  catchList.push(...c);
}

console.log(catchList.length)


const numberOfCatches = await db.catch.aggregate({
  where: {
    OR: catchList
  },
  _count: {
    id: true,
  },
});


  const catches = await db.catch.findMany({
    where:{
      OR:catchList
    },
    select: {
      id: true,
      waterArea: {
        select: {
          waterAreaCode: true,
          waterAreaName: true,
        },
      },
      logbook: {
        select: {
          member: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      createdAt: true,
      isInjured: true,
      isStored: true,
      fish: {
        select: {
          id: true,
          fishCode: true,
          fishName: true,
          fishImageURL: true,
        },
      },
      CatchDetails: {
        select: {
          value: true,
          unit: {
            select: {
              unitAcronyms: true,
            },
          },
        },
      },
    },
    skip: skip,
    take: take,
  })

  return { catches: catches, numberOfCatches: numberOfCatches };
}


