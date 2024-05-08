"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/map-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";


export async function deleteMap(mapId:string){
  const session = await auth();

  if (!session) {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "There is no valid session",
        status: "error",
        description: "There is no valid session! Sign in again! ",
      },
    };
  }

  if (session.user.role !== "OPERATOR") {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to edit map!",
      },
    };
  }

  const map = await db.map.findUnique({
    where:{
        id: mapId
    }
  })

  if(!map){
    return {
        errors: {
          _form: ["Map not found!"],
          subtitle: "Map does not exist",
          status: "error",
          description: "The map you want to delete does not exist",
        },
      };
  }


  const member = await db.member.findFirst({
    where: {
        user:{
            email: session.user.email
        },
        fisheryAuthorityId: map.fisheryAuthorityId
    },

    select:{
        fisheryAuthorityId:true,
        user:{
            select:{
                role:true
            }
        }
    }
  })

  if(!member){
    return {
        errors: {
          _form: ["Authorization failed!"],
          subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to delete map!",
        },
      };
  }

  if(member.user.role !== "OPERATOR"){
    return {
        errors: {
          _form: ["The creation failed!"],
          subtitle: "The user is not a member",
          status: "error",
          description: "The user is not a member of any association!",
        },
      };
  }


  try {

    await db.marker.deleteMany({
        where:{
            mapId: map.id
        }
    })

    await db.map.delete({
        where:{
            id: map.id
        }
    })

    revalidatePath(`/map`);

    return {
      errors: {
        _form: ["The map deleted successfully"],
        subtitle: "Successfull deletion!",
        status: "success",
        description: "The map deleted successfully",
      },
    };

  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The creation failed!",
        status: "error",
        description: error.message,
      },
    };
  }
}
