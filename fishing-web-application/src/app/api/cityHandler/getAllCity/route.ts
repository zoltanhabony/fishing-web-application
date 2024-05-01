import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { auth } from "@/auth"

type city = {
    id: string,
    cityName:  string,
}

export async function GET(request: NextRequest) {

    const session = await auth();
        if(session){
            if(session.user.role === "OPERATOR" || session.user.role === "ADMIN"){

                const name =  request.nextUrl.searchParams.get("name")

                let city: city[] = []

                if(name === "" || name === null){
                    return NextResponse.json(
                        { cities: city, message: "Az adatok lekérése sikeresen megtörtént!"},
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
                    { cities: city, message: "Az adatok lekérése sikeresen megtörtént!" },
                    { status: 200 }
                )
            }
            return NextResponse.json(
                { message: "Az adatok lekérése sikertelen: Nincs megfelelő jogosultság az adatok lekéréséhez!" },
                { status: 301 }
            )
        }
    
        return NextResponse.json(
            { message: "Az adatok lekérése sikertelen: Nincs érvényes munkamenet!" },
            { status: 301 }
        )
  }