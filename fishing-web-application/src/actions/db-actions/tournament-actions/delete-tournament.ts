"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface DeleteTournamentFormState {
  errors?: {
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function deleteTournament(id: string) {
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
        description: "You do not have access to delete tournament!",
      },
    };
  }

  const tournament = await db.tournament.findUnique({
    where:{
        id: id
    },
    select:{
        isFinished:true,
        id:true,
        fisheryAuthorityId:true,
        fisheryAuthority: {
            select:{
                fisheryAuthorityName: true
            }
        }
    }
  })

  if(!tournament){
    return {
        errors: {
          _form: ["The deletion failed!"],
          subtitle: "No torunament found",
          status: "error",
          description: "No tournament found!",
        },
      };
  }

  const member = await db.member.findFirst({
    where: {
      user: {
        email: session.user.email,
        role: session.user.role
      },
      fisheryAuthorityId: tournament.fisheryAuthorityId,
    },
  });

  if (!member) {
    return {
      errors: {
        _form: ["The deletion failed!"],
        subtitle: "You are not a member",
        status: "error",
        description: "You are not a member of any association!",
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
          fisheryAuthorityName: ["You are not the operator of this association!"],
          _form: ["The deletion failed!"],
          subtitle: "No access to perform the operation",
          status: "error",
          description: "You can only delete a tournament for your own associations!",
        },
      };
  }

  if(!tournament.isFinished){
    return {
        errors: {
          fisheryAuthorityName: ["You cannot delete this competition!"],
          _form: ["The deletion failed!"],
          subtitle: "No access to perform the operation",
          status: "error",
          description: "You cannot cancel a competition that is still running!",
        },
      };
  }

  try {
    revalidatePath(`/tournament`);
    await db.participant.deleteMany({
        where:{
            tournamentId: tournament.id
        }
    })
    await db.tournament.delete({
      where:{
        id:tournament.id
      }
    });

    return {
      errors: {
        _form: ["The post deleted successfully"],
        subtitle: "Successfull deletion!",
        status: "success",
        description: "The post deleted successfully",
      },
    };
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The deletion failed!",
        status: "error",
        description: error.message,
      },
    };
  }
}
