'use server'

import { auth } from "@/auth"
import db from "@/lib/db"

export async function getCurretUserAccess() {
    const session = await auth()
    const access = await db.access.findFirst({
        where: {
            user: {
                email: session?.user.email
            }
        }
    })

    return access
}