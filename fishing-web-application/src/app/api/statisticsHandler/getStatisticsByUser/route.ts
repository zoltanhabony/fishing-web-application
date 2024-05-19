import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (session) {
      let year = request.nextUrl.searchParams.get("year");


      if (!year) {
        year = String(new Date().getFullYear());
      }

      try {

        const haveLogbook = await db.logbook.findFirst({
            where:{
                member:{
                    user:{
                        email: session.user.email
                    }
                }
            }
        })
        
        if(!haveLogbook){
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

        //Fogasok havi bontasa oszlop diagramhoz
        let catchByMonths: any = [];

        for (let i = 1; i < 13; i++) {
          const catchByMonth = await db.catch.aggregate({
            where: {
              logbookId: haveLogbook.id,
              createdAt: {
                gte: new Date(year + "-" + i + "-01"),
                lte: new Date(year + "-" + i + "-31"),
              },
            },
            _count: {
              id: true,
            },
          });

          catchByMonths[i - 1] = catchByMonth._count.id;
        }

        let allFishType: any[] = [];

        //Hal típusok kör diagramhoz
        const fishTypes = await db.fish.findMany({
          select: {
            id: true,
            fishName: true,
          },
        });

        for (let fish of fishTypes) {
          allFishType.push(fish.fishName);
        }

        let fishGroupSizes: any[] = [];

        for (let i of fishTypes) {
          const groupByFishname = await db.catch.aggregate({
            where: {
              logbookId: haveLogbook.id,
              fish: {
                fishName: i.fishName,
              },
              createdAt: {
                gte: new Date(year + "-01-01"),
                lte: new Date(year + "-12-31"),
              },
            },
            _count: {
              id: true,
            },
          });

          fishGroupSizes.push(groupByFishname._count.id);
        }

        //Injured fish or not for line bar
          let healthyFishCounts:any[] = []

          for (let i = 1; i < 13; i++) {
            const healthyFish = await db.catch.aggregate({
              where: {
                logbookId: haveLogbook.id,
                createdAt: {
                  gte: new Date(year + "-" + i + "-01"),
                  lte: new Date(year + "-" + i + "-31"),
                },
                isInjured: false
              },
              _count: {
                id: true,
              },
            });
  
            healthyFishCounts[i - 1] = healthyFish._count.id;
          }

          let injuredFishCounts:any[] = []

          for (let i = 1; i < 13; i++) {
            const injuredFish = await db.catch.aggregate({
              where: {
                logbookId: haveLogbook.id,
                createdAt: {
                  gte: new Date(year + "-" + i + "-01"),
                  lte: new Date(year + "-" + i + "-31"),
                },
                isInjured: true
              },
              _count: {
                id: true,
              },
            });
  
            injuredFishCounts[i - 1] = injuredFish._count.id;
          }

        return NextResponse.json(
          {
            monthlyCatch: catchByMonths,
            fishTypes: allFishType,
            fishGroupSizes: fishGroupSizes,
            healthyFishCounts: healthyFishCounts,
            injuredFishCounts:injuredFishCounts,
            message: "The data has been successfully retrieved!",
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            monthlyCatch: [],
            fishTypes: [],
            fishGroupSizes: [],
            message: "Data retrieval failed!",
          },
          { status: 200 }
        );
      }
  }

  return NextResponse.json(
    {
      monthlyCatch: [],
      message: "Data retrieval failed: no valid session!",
    },
    { status: 301 }
  );
}
