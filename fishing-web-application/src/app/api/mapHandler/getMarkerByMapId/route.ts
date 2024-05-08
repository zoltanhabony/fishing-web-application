import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";
import { UserRole } from "@prisma/client";

type markers = {
    id: string;
    info: string;
    lat: Decimal;
    long: Decimal;
    member: {
        fisheryAuthority: {
            fisheryAuthorityName: string;
        };
        user: {
            name: string | null;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
        };
    };
    markerType: {
        type:string,
        markerURL:string,

    };
    isAuthor: boolean;
    title: string;
    createdAt: Date;
}[]

export async function GET(request: NextRequest) {
  const session = await auth();
  const id = request.nextUrl.searchParams.get("id");
  const emptyMarkers:markers[] = []

  if (session) {

    const fisheryAuthority = await db.map.findUnique({
        where:{
            id: id?.toString()
        },
        select:{
            fisheryAuthorityId:true
        }
    })

    if(session.user.role === UserRole.OPERATOR){
        const currentMember = await db.map.findFirst({
            where:{
                id: id?.toString(),
                member:{
                    user:{
                        email: session.user.email
                    }
                }
            },
            select:{
                memberId:true,
            }
        })

        try {
            const xdb = db.$extends({
                result: {
                  marker:{
                    isAuthor:{
                        needs: { memberId:true },
                        compute(marker){
                            return Boolean(currentMember?.memberId)
                        }
                    }
                  }
                },
              });
            
              const markers = await xdb.marker.findMany({
                where:{
                    map:{
                        fisheryAuthorityId: String(fisheryAuthority?.fisheryAuthorityId)
                    }
                },
                select:{
                    id:true,
                    lat:true,
                    long:true,
                    isAuthor:true,
                    title:true,
                    info:true,
                    createdAt:true,
                    markerType:{
                        select:{
                            type:true,
                            markerURL:true,
                        }
                    },
                    member:{
                        select:{
                            user:{
                                select:{
                                    name:true,
                                    firstName:true,
                                    lastName:true,
                                    email:true,
                                    image:true
                                }
                            },
                            fisheryAuthority:{
                                select:{
                                    fisheryAuthorityName:true,
                                }
                            }
                        }
                    }
                }
            })
    
            if(!markers){
                return NextResponse.json(
                    { markers: emptyMarkers, message: "Az adatok lekérése sikertelen!" },
                    { status: 404 }
                  );
            }
    
            return NextResponse.json(
                { markers: markers, message: "Az adatok lekérése sikeresen megtörtént!" },
                { status: 200 }
              )
            
        }catch(e){
            return NextResponse.json(
                { markers: emptyMarkers, message: `Az adatok lekérése sikertelen: ${e}` },
                { status: 200 }
              )
        }
    }

    const currentMember = await db.member.findFirst({where:{
        user:{
            email: session.user.email
        }
    }})
    
    try {
        const xdb = db.$extends({
            result: {
              marker:{
                isAuthor:{
                    needs: { memberId:true },
                    compute(marker){
                        return (marker.memberId === currentMember?.id)
                    }
                }
              }
            },
          });
        
          const markers = await xdb.marker.findMany({
            where:{
                map:{
                    fisheryAuthorityId: String(fisheryAuthority?.fisheryAuthorityId)
                }
            },
            select:{
                id:true,
                lat:true,
                long:true,
                isAuthor:true,
                title:true,
                info:true,
                createdAt:true,
                markerType:{
                    select:{
                        type:true,
                        markerURL:true,
                    }
                },
                member:{
                    select:{
                        user:{
                            select:{
                                name:true,
                                firstName:true,
                                lastName:true,
                                email:true,
                            }
                        },
                        fisheryAuthority:{
                            select:{
                                fisheryAuthorityName:true,
                            }
                        }
                    }
                }
            }
        })

        if(!markers){
            return NextResponse.json(
                { markers: emptyMarkers, message: "Az adatok lekérése sikertelen!" },
                { status: 404 }
              );
        }

        return NextResponse.json(
            { markers: markers, message: "Az adatok lekérése sikeresen megtörtént!" },
            { status: 200 }
          )
        
    }catch(e){
        return NextResponse.json(
            { markers: emptyMarkers, message: `Az adatok lekérése sikertelen: ${e}` },
            { status: 200 }
          )
    }

   
  }

  return NextResponse.json(
    { markerTypes: emptyMarkers, message: "Az adatok lekérése sikertelen: Nincs érvényes munkamenet!" },
    { status: 301 }
  );
}
