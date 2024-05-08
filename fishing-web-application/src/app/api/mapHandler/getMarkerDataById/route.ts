import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";

type marker =  {
    id: string;
    info: string;
    lat: Decimal;
    long: Decimal;
    mapId: string;
    title: string;
    markerType: {
        id:string;
        type: string;
    };
} | null

export async function GET(request: NextRequest) {
  const session = await auth();
  const id = request.nextUrl.searchParams.get("id");
  
  const emptyMarker: marker = null

  if (session) {

    try {

        const marker = await db.marker.findUnique({
            where:{
                id: id?.toString()
            },
            select:{
                id:true,
                mapId:true,
                lat: true,
                long:true,
                title:true,
                info:true,
                markerType:{
                    select: {
                        id:true,
                        type:true,
                    }
                }
            }
        })

        if(!marker){
            return NextResponse.json(
                { marker: emptyMarker, message: `Az adatok lekérése sikertelen` },
                { status: 200 }
              )
        }



        //if current user created
        const isMember = await db.marker.findUnique({
            where:{
                id: marker.id,
                member:{
                    user:{
                        email: session.user.email
                    }
                }
            },

            select:{
                member:{
                    select:{
                        id:true
                    }
                    
                }
            }
        })

        
        //if is operateor for map
        const isOperator = await db.marker.findUnique({
            where: {
              id: marker.id,
              map: {
                id: marker.mapId,
                member:{
                    user:{
                        email: session.user.email
                    }
                }
              }
            },
          });

          if(!isMember && !isOperator){
            return NextResponse.json(
                { marker: emptyMarker, message: `Az adatok lekérése sikertelen` },
                { status: 200 }
              )
          }

            return NextResponse.json(
                { marker: marker, message: "Az adatok lekérése sikeresen megtörtént!" },
                { status: 200 }
              )
            
        }catch(e){
            return NextResponse.json(
                { marker: emptyMarker, message: `Az adatok lekérése sikertelen: ${e}` },
                { status: 200 }
              )
        }
    }
   


  return NextResponse.json(
    { marker: emptyMarker, message: "Az adatok lekérése sikertelen: Nincs érvényes munkamenet!" },
    { status: 301 }
  );

}