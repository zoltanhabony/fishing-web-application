import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";
import { UserRole } from "@prisma/client";

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
    if(session.user.role === UserRole.OPERATOR){
        let authorityName = request.nextUrl.searchParams.get("authority");
        try {
            if (!authorityName) {
                const name = await db.member.findFirst({
                  where: {
                    user: {
                      email: session.user.email,
                    },
                  },
                  select: {
                    fisheryAuthority: {
                      select: {
                        fisheryAuthorityName: true,
                      },
                    },
                  },
                });
        
                authorityName = String(name?.fisheryAuthority.fisheryAuthorityName);
              }

              const authority = await db.fisheryAuthority.findFirst({
                where: {
                  fisheryAuthorityName: String(authorityName),
                },
              });
      
              if(authority === undefined || authority === null){
                return NextResponse.json(
                  {
                    catches: emptyCatches,
                    message: "The data has been successfully retrieved!",
                  },
                  { status: 200 }
                );
              }
      
              const memberships = await db.member.findMany({
                where: {
                  user: {
                    email: session?.user.email,
                  },
                },
                select: {
                  fisheryAuthority: {
                    select: {
                      fisheryAuthorityName: true,
                      id: true,
                    },
                  },
                },
              });
      
              const isMember = memberships.find((f)=>{
                return f.fisheryAuthority.fisheryAuthorityName === authority.fisheryAuthorityName
              })
      
              if(!isMember){
                return NextResponse.json(
                  {
                    catches: emptyCatches,
                    message: "Data retrieval failed: No access!",
                  },
                  { status: 200 }
                );
              }


            const catches: catchesType = await db.catch.findMany({
              where: {
                waterAreaId: authority.waterAreaId
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
  }
  return NextResponse.json(
    {
      caches: emptyCatches,
      message: "Data retrieval failed: no valid session!",
    },
    { status: 301 }
  );
}
