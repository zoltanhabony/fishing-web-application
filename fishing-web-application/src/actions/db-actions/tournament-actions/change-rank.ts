"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/tournament-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";


interface ChangeRankFormState {
  errors?: {
    tournamentId?:string[]
    ranks?:string[];
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

type rank = {
    id: string;
    member: {
      id: string;
      user: {
        image: string | null;
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
      };
    };
  }

export async function changeRank(
  formSate: ChangeRankFormState,
  formData: FormData,
): Promise<ChangeRankFormState> {
  const session = await auth();

  const data = {
    tournamentId: formData.get("tournamentId"),
    ranks:formData.get("ranks")
  };

  const result = schemas.changeRankSchema.safeParse(data);

  if (!result.success) {
   
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

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

  const tournament = await db.tournament.findUnique({
    where:{
        id:result.data.tournamentId
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
          tournamentId: ["No tournament found in the given name!"],
          _form: ["The rank changing failed!"],
          subtitle: "No tournament found",
          status: "error",
          description: "No tournament found in the given id!",
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
    revalidatePath(`/tournament`);
    const ranks = JSON.parse(result.data.ranks)

    ranks.forEach(async(value:rank, index:number)=>{
        await db.participant.update({
            where:{
                tournamentId:tournament.id,
                id: value.id,
                member:{
                    id: value.member.id
                }
            },
            data:{
                rank: index + 1
            }
        })
    })

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
