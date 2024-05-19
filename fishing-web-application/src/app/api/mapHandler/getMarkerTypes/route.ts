import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";



type markerTypes = {
        id: string;
        type: string;
        markerURL: string;
}[]

export async function GET(request: NextRequest) {
  const session = await auth();
  const emptyMarkerType: markerTypes[] = []
  if (session) {


    try {
        const markerTypes = await db.markerType.findMany({
            select:{
                id:true,
                type:true,
                markerURL:true
            }
        })

        if(!markerTypes){
            return NextResponse.json(
                { markerTypes: emptyMarkerType, message: "Data retrieval failed!" },
                { status: 404 }
              );
        }

        return NextResponse.json(
            { markerTypes: markerTypes, message: "The data has been successfully retrieved!" },
            { status: 200 }
          )
        
    }catch(e){

    }
  }

  return NextResponse.json(
    { markerTypes: emptyMarkerType, message: "Data retrieval failed: no valid session!" },
    { status: 301 }
  );
}
