"use server"
import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteCatch(id: string) {

    const session = await auth()

    if(!session){
        return {
            message:"No session found!"
        }
    }

    const currentUser = await db.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if(!currentUser){
        return {
            message:"No user found!"
        }
    }


    const isOwnCatch = await db.catch.findFirst({
        where: {
            id: id,
            logbook:{
                member:{
                    user:{
                        id: currentUser.id
                    }
                }
            }
        }
    })

    
    if(!isOwnCatch){
        return {
            message:"No catch found!"
        }
    }

    try {
        
        await db.catch.delete({
            where:{
                    id: isOwnCatch.id
            }
        })
       

        revalidatePath("/catch")
        return {
            message:"Catch deleted successfully"
        }
    } catch (error: any) {
        return {
            message:error.message
        }
    }
}
