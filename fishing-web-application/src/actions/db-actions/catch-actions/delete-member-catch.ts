"use server"
import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteMemberCatch(id: string) {

    const session = await auth()

    if(!session) {
        return {
            message:"No session"
        }
    }

    const access = await db.access.findFirst({
        where:{
            user:{
                email: session.user.email
            }
        }
    })

    if(session.user.role !== "OPERATOR" && (session.user.role !== "INSPECTOR" || !access?.accessToCatches)){ 
        return {
            message:"No access"
        }
    }
    
    const catchById = await db.catch.findUnique({
        where:{
            id: id
        }
    })

    if(!catchById){
        return {
            message:"No catch found!"
        }
    }


    try {
        
        await db.catch.delete({
            where:{
                    id: catchById.id
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
