"use server"
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteMemberCatch(id: string) {
    
    const catchById = await db.catch.findUnique({
        where:{
            id: id
        }
    })

    if(!catchById){
        console.log("No catch found!")
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
        console.log(error.message)
        return {
            message:error.message
        }
    }
}
