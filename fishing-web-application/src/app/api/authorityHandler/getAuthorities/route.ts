import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { auth } from "@/auth"

type authority = {
    id: string,
    fisheryAuthorityName:  string,
}

export async function GET(request: NextRequest) {

        const session = await auth()
        if(session){
            if(session.user.role === "OPERATOR" || session.user.role === "ADMIN"){

                const name =  request.nextUrl.searchParams.get("name")

                let authority: authority[] = []

                if(name === "" || name === null){
                    return NextResponse.json(
                        { authorities: authority, message: "The data has been successfully retrieved!"},
                        { status: 200 })
                }

                authority = await db.fisheryAuthority.findMany({
                    where:{
                        fisheryAuthorityName: {
                            contains: name,
                            mode: 'insensitive'
                        }
                    },
                    select: {
                        id: true,
                        fisheryAuthorityName:true,
                    }
                })
                

                return NextResponse.json(
                    { authorities: authority, message: "The data has been successfully retrieved!" },
                    { status: 200 }
                )
            }
            return NextResponse.json(
                { message: "Failed to retrieve the data: you do not have the right to retrieve the data!" },
                { status: 301 }
            )
        }
    
        return NextResponse.json(
            { message: "Data retrieval failed: no valid session!" },
            { status: 301 }
        )
  }