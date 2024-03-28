'use server'

import { auth } from "@/auth"
import db from "@/lib/db"

export async function getAuthorityData() {
    const session = await auth()
    
    const profileData = await db.user.findUnique({
        where: {
            email: session?.user.email
        },
        select:{
            name:true,
            email:true,
            firstName:true,
            lastName: true,
            image:true
        }
    })

    return profileData
}