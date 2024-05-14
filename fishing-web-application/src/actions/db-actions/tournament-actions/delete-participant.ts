"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/tournament-schema";
import db from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
import { table } from "console";
import { revalidatePath } from "next/cache";
import { json } from "stream/consumers"

interface CreatePostFormState {
  errors?: {
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function deleteParticipant(tournamentId:string, participantId:string){
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
        description: "You do not have access to change rank!",
      },
    };
  }

  console.log(tournamentId)

  const tournament = await db.tournament.findUnique({
    where:{
        id:tournamentId
    },
    select:{
        id:true,
        fisheryAuthority:{
            select:{
                id:true,
                fisheryAuthorityName:true
            }
        }
    }
  })

  if(!tournament){
    return {
        errors: {
          _form: ["The rank changing failed!"],
          subtitle: "No tournament found",
          status: "error",
          description: "No tournament found in the given id!",
        },
      };
  }
  
  const participant = await db.participant.findUnique({
    where: {
        id: participantId,
        tournamentId: tournamentId
    }
  })

  if(!participant) {
    return {
        errors: {
          _form: ["The participant deletion failed!"],
          subtitle: "No participant found",
          status: "error",
          description: "No participant found in the given id!",
        },
      };
  }

  
  const member = await db.member.findFirst({
    where: {
        user:{
            email: session.user.email
        },
        fisheryAuthorityId:tournament.fisheryAuthority.id
    }
  })

  if(!member){
    return {
        errors: {
          _form: ["The creation failed!"],
          subtitle: "The user is not a member",
          status: "error",
          description: "The user is not a member of any association!",
        },
      };
  }

  //Memberships between authority (Where)
  const memberships = await db.member.findMany({
    where: {
      user: {
        email: session?.user.email,
        role: "OPERATOR"
      },
    },
    select: {
      fisheryAuthority: {
        select: {
          fisheryAuthorityName: true,
          id: true,
        },
      },
    },
  });


  const isMember = memberships.find((f)=>{
    return f.fisheryAuthority.fisheryAuthorityName === tournament.fisheryAuthority.fisheryAuthorityName
  })

  if(!isMember){
    return {
        errors: {
          _form: ["The rank changing failed!"],
          subtitle: "No access to perform the operation",
          status: "error",
          description: "You can only change rank for your own association's tournaments!",
        },
      };
  }


  try {
    console.log("ok")
    
    await db.participant.delete({
        where:{
            id: participant.id
        }
    })
    
    revalidatePath(`/tournament`);
    

    return {
      errors: {
        _form: ["Successful data saving"],
        subtitle: "Successfull saving!",
        status: "success",
        description: "The fish saved successfully! You can view the saved fish at catches.",
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
