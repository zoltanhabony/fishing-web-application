"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/tournament-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { date } from "zod";

interface ApplyForTournamentFormState {
  errors?: {
    id?:string[]
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function applyForTournament(
  formSate: ApplyForTournamentFormState,
  formData: FormData
): Promise<ApplyForTournamentFormState> {
  const session = await auth();

  const data = {
    id: formData.get("id"),
  };

  const result = schemas.applyForTournamentSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error);
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

  if (session.user.role !== "USER" && session.user.role !== "INSPECTOR") {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to apply for tournament! This featrue only available for users and some inspectors",
      },
    };
  }

  const user = await db.user.findUnique({
    where: {
        email: session.user.email
    },
    select:{
        member:{
            select:{
                id:true
            }
        }
    }
  })

  if(!user){
    return {
        errors: {
          _form: ["Access denide!"],
          subtitle: "No access to apply for tournament",
          status: "error",
          description: "You cannot enter a competition because you are not a member of an association!",
        },
      };
  }

  const tournament = await db.tournament.findUnique({
    where:{
        id: result.data.id
    }
  })

  if(!tournament){
    return {
        errors: {
          _form: ["Unsuccessful application!"],
          subtitle: "Competition does not exist",
          status: "error",
          description: "The competition you want to register for does not exist!",
        },
      };
  }

  const isParticipant = await db.participant.findFirst({
    where:{
      memberId: user.member[0].id,
      tournamentId: tournament.id
    }
  })
  
  if(isParticipant) {
    return {
      errors: {
        _form: ["Unsuccessful application!"],
        subtitle: "Already signed up",
        status: "warning",
        description: "You have already registered for this competition!",
      },
    };
  }

  const participants = await db.participant.aggregate({
    where: {
      tournamentId: tournament.id
    },
    _count: {
      id: true
    }
  })

  if(tournament.maxParticipants < participants._count.id + 1){
    return {
      errors: {
        _form: ["Unsuccessful application!"],
        subtitle: "No place available",
        status: "warning",
        description: "You cannot enter the competition, places are full!",
      },
    };
  }

  try {

    await db.participant.create({
        data: {
            memberId: user.member[0].id,
            tournamentId: tournament.id,
            rank: null
        }
    })

    revalidatePath(`/tournament`);

    return {
      errors: {
        _form: ["Start fishing successfully"],
        subtitle: "Good Luck!",
        status: "success",
        description: "You are start fishing successfully",
      },
    };
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The fishing not started!",
        status: "error",
        description: error.message,
      },
    };
  }
}
