import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";

type catchesType = {
    id: string;
    fish: {
        id: string;
        fishName: string;
        fishImageURL: string;
    };
    waterArea: {
        waterAreaName: string;
    };
    createdAt: Date;
    CatchDetails: {
        value: Decimal;
        unit: {
            unitAcronyms: string;
        };
    }[];
}[]

export async function GET(request: NextRequest) {
  const session = await auth();
  const emptyCatches: catchesType = []
  if (session) {
    try {
      const haveLogbook = await db.logbook.findFirst({
        where: {
          member: {
            user: {
              email: session.user.email,
            },
          },
        },
      });

      if (!haveLogbook) {
        return NextResponse.json(
          {
            monthlyCatch: [],
            fishTypes: [],
            fishGroupSizes: [],
            message: "Data retrieval failed: No data!",
          },
          { status: 200 }
        );
      }

      const catches: catchesType = await db.catch.findMany({
        where: {
          logbookId: haveLogbook.id,
        },
        select: {
          id: true,
          createdAt: true,
          waterArea: {
            select: {
              waterAreaName: true,
            },
          },

          fish: {
            select: {
              id: true,
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
        
        take: 9,
        orderBy:{
            createdAt: "desc"
        }
      });

      return NextResponse.json(
        {
          catches: catches,
          message: "The data has been successfully retrieved!",
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          caches: emptyCatches,
          message: "The data has been successfully retrieved!",
        },
        { status: 200 }
      );
    }
  }

  return NextResponse.json(
    {
        caches: emptyCatches,
      message: "Data retrieval failed: no valid session!",
    },
    { status: 301 }
  );
}
