'use server'

import { auth } from "@/auth"
import db from "@/lib/db"

export async function getProfileData() {
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
            image:true,
            isTwoFactorEnabled:true,
            member:{
                select:{
                    logBook:{
                        select:{
                            id: true,
                            expiresDate: true,
                        }
                    },
                    fisheryAuthority: {
                        select: {
                          id: true,
                          fisheryAuthorityName: true,
                          waterArea: {
                            select: {
                              waterAreaCode: true,
                              waterAreaName: true,
                            },
                          },
                        },
                      },
                }
            }
        }
    })

    return profileData
}