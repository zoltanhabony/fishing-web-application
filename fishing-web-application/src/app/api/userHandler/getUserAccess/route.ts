import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { auth } from "@/auth"


type user = {
    id: string,
    name:  string | null,
}

export async function GET(request: NextRequest) {

        const session = await auth()
        if(session){
            const access = await db.access.findFirst({
                where:{
                    user:{
                        email: session.user.email
                    }
                }
        })
            return NextResponse.json(
                { access: access, message: "Failed to retrieve the data: you do not have the right to retrieve the data!" },
                { status: 200 }
            )
        }
    
        return NextResponse.json(
            { access: null, message: "Data retrieval failed: no valid session!" },
            { status: 301 }
        )
  }