"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type catchesResponse = {
    id: string;
    createdAt: Date;
    isInjured: boolean | null;
    isStored: boolean;
    waterArea: {
        waterAreaCode: string;
        waterAreaName: string;
    };
    fish: {
        id: string;
        fishCode: number | null;
        fishName: string;
        fishImageURL: string;
    };
    CatchDetails: {
        value: Decimal;
        unit:{
            unitAcronyms: string
        }
    }[];
}[]

export async function getCatchByUser(
  page: string,
  row: string,
  search: string,
  sort: string,
  direction: string,
  isSaved: "true" | "false" | "undefined"
) {
  const currentPage = page ? page : 1;
  const currentRow = row ? row : 5;
  const currentSearch = search ? search : "";

  const currentSort = sort as Prisma.CatchOrderByRelevanceFieldEnum;

  let currentOrder = "" as Prisma.SortOrder;
  let currentIsSaved: boolean | undefined = undefined;

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



  const skip = +currentPage * +currentRow - +currentRow;
  const take = +currentRow;

  const session = await auth();

  let noData: catchesResponse = []

  if(!session){
    return { catches: noData, numberOfCatches: 0 };
  }
 

  const currentUser = await db.user.findUnique({
    where:{
        email: session.user.email
    }
  })

  if(!currentUser) {
    return { catches: noData, numberOfCatches: 0 };
  }

  try {

    if (
        currentSort in Prisma.CatchOrderByRelevanceFieldEnum &&
        currentOrder in Prisma.SortOrder
      ) {
        const catches = await db.catch.findMany({
          where: {
            logbook:{
                member:{
                    userId: currentUser.id
                }
            },
            isStored: currentIsSaved,
            waterArea:{
                waterAreaName: {
                    contains: currentSearch
                }
            }
          },
          select: {
            id: true,
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
                logbook:{
                    member:{
                        userId: currentUser.id
                    }
                },
                isStored: currentIsSaved,
                waterArea:{
                    waterAreaName: {
                        contains: currentSearch
                    }
                }
            },
            orderBy: {
              [currentSort]: currentOrder,
            },
            _count: {
              id: true,
            },
          });

          return { catches: catches, numberOfCatches: numberOfCatches._count.id };
    }

    const catches = await db.catch.findMany({
        where: {
          logbook:{
              member:{
                  userId: currentUser.id
              }
          },
          isStored: currentIsSaved,
          waterArea:{
              waterAreaName: {
                  contains: currentSearch
              }
          }
        },
        select: {
          id: true,
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
      });

      const numberOfCatches = await db.catch.aggregate({
        where: {
            logbook:{
                member:{
                    userId: currentUser.id
                }
            },
            isStored: currentIsSaved,
            waterArea:{
                waterAreaName: {
                    contains: currentSearch
                }
            }
        },
        _count: {
          id: true,
        },
      });
      return { catches: catches, numberOfCatches: numberOfCatches._count.id };

  }catch(e){
    return { catches: noData, numberOfCatches: 0 }
  }

 ;
}


