"use server"
import db from "@/lib/db";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteMember(id: string) {

    
    const member = await db.member.findFirst({
        where:{
            id:id
        }
    })

    if(!member?.logbookId){
        console.log("Member has no logbook found!")
        return {
            message:"Member has no logbook found!"
        }
    }

    const logbook = await db.logbook.findUnique({
        where:{
            id: member?.logbookId
        }
    })
    
    if(!logbook){
        console.log("No logbook found!")
        return {
            message:"No logbook found!"
        }
    }


    try {

        await db.catchDetails.deleteMany({
            where:{
                catch:{
                    logbookId:logbook.id
                }
            }
        })
        
        await db.catch.deleteMany({
            where:{
                logbookId: logbook.id
            }
        })

        await db.logbook.delete({
            where:{
                id: member.logbookId
            }
        })

        await db.user.update({
            where:{
                id: member.userId
            },data:{
                role: UserRole.USER
            }
        })

        await db.access.update({
            where:{
                userId: member.userId
            },
            data:{
                accessToFishing: false,
                accessToLogbook: false,
            }
        })
       

        revalidatePath("/member")
        return {
            message:"Authority deleted successfully"
        }
    } catch (error: any) {
        console.log(error.message)
        return {
            message:error.message
        }
    }
}
