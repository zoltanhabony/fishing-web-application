import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { auth } from "@/auth"

type city = {
    id: string,
    cityName:  string,
}

export async function GET(request: NextRequest) {

    const session = await auth();
    let city: city[] = []
        if(session){
            if(session.user.role === "OPERATOR"){

                const name =  request.nextUrl.searchParams.get("name")

                if(name === "" || name === null){
                    return NextResponse.json(
                        { cities: city, message: "The data has been successfully retrieved!"},
                        { status: 200 })
                }

                city = await db.city.findMany({
                    where:{
                        cityName: {
                            contains: name,
                            mode: 'insensitive'
                        }
                    },
                    select: {
                        id: true,
                        cityName:true,
                    }
                })
                

                return NextResponse.json(
                    { cities: city, message: "The data has been successfully retrieved!" },
                    { status: 200 }
                )
            }
            return NextResponse.json(
                { cities: city, message: "Failed to retrieve the data: you do not have the right to retrieve the data!" },
                { status: 301 }
            )
        }
    
        return NextResponse.json(
            { message: "Data retrieval failed: no valid session!" },
            { status: 301 }
        )
  }