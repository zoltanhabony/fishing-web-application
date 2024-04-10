"use server"
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function removeLogbook(id: string) {
    try {

        const logbook = await db.logbook.findUnique({
            where:{
                id:id
            }
        })

        if(!logbook){
            return {
                message:"Deletion Failed!"
            }
        }

        await db.logbook.delete({
            where:{
                id: id
            }
        })

        revalidatePath("/logbook")
        return {
            message:"Authority deleted successfully"
        }
    } catch (error: any) {
        return {
            message:error.message
        }
    }
}