"use server"
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function removefisheryAuthorities(id: string) {
    try {

        const authority = await db.fisheryAuthority.findUnique({
            where:{
                id:id
            }
        })

        if(!authority){
            return {
                message:"Deletion Failed!"
            }
        }

        await db.fisheryAuthority.delete({
            where:{
                id: id
            }
        })

        await db.address.delete({
            where:{
                id: authority.addressId
            }
        })

        revalidatePath("/authority")
        return {
            message:"Authority deleted successfully"
        }
    } catch (error: any) {
        return {
            message:error.message
        }
    }
}