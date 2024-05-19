import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";

type map = {
    lat: Decimal;
    long: Decimal;
    zoom: number;
    fisheryAuthority: {
        fisheryAuthorityName: string;
        waterArea: {
            waterAreaName: string;
        };
    };
    Marker: {
        id: string;
        info: string;
        lat: Decimal;
        long: Decimal;
        member: {
           user:{
                name:string |null,
                firstName: string | null
                lastName: string | null
                email: string | null
           }
        }
        title: string;
        createdAt: Date;
    }[] | null;
} | null

export async function GET(request: NextRequest) {
  const session = await auth();


  if (session) {
    const id = request.nextUrl.searchParams.get("id");
    const emptyMap: map[] = []
    
    try {
        const map = await db.map.findUnique({
            where: {
                id: id?.toString()
            },
            
            select:{
                Marker:{
                    select:{
                        id:true,
                        lat:true,
                        long:true,
                        createdAt:true,
                        title:true,
                        info:true,
                        member:{
                            select:{
                                user:{
                                    select:{
                                        name:true,
                                        firstName:true,
                                        lastName:true,
                                        email:true
                                    }
                                }
                            }
                        }
                    }
                },
                lat:true,
                long:true,
                zoom:true,
                fisheryAuthority:{
                    select:{
                        id:true,
                        fisheryAuthorityName:true,
                        waterArea:{
                            select: {
                                waterAreaName: true
                            }
                        }
                    }
                },
                
            }
        })

        if(!map){
            return NextResponse.json(
                { map: emptyMap, message: "Data retrieval failed!" },
                { status: 404 }
              );
        }

        return NextResponse.json(
            { map: map, message: "The data has been successfully retrieved!" },
            { status: 200 }
          )
        
    }catch(e){

    }
  }

  return NextResponse.json(
    { message: "Data retrieval failed: no valid session!" },
    { status: 301 }
  );
}
