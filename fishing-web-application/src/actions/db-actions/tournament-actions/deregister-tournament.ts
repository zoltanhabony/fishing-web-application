"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/tournament-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { date } from "zod";

interface deregisterFromTournamentFormState {
  errors?: {
    id?:string[]
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function deregisterFromTournament(
  formSate:  deregisterFromTournamentFormState,
  formData: FormData
): Promise<deregisterFromTournamentFormState> {
  const session = await auth();

  const data = {
    id: formData.get("id"),
  };

  const result = schemas.applyForTournamentSchema.safeParse(data);

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
          subtitle: "No access to deregister for tournament",
          status: "error",
          description: "No access to deregister for tournament!",
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
          _form: ["Unsuccessful deregister!"],
          subtitle: "Competition does not exist",
          status: "error",
          description: "The competition you want to deregister for does not exist!",
        },
      };
  }

  const isParticipant = await db.participant.findFirst({
    where:{
      memberId: user.member[0].id,
      tournamentId: tournament.id
    },select:{
        id:true
    }
  })
  
  if(!isParticipant) {
    return {
      errors: {
        _form: ["Unsuccessful deregistration!"],
        subtitle: "You are not registered",
        status: "error",
        description: "You have not registered for the competition, so you cannot unsubscribe!",
      },
    };
  }

  try {

    await db.participant.delete({
        where: {
            id:isParticipant.id
        }
    })

    revalidatePath(`/tournament`);

    return {
      errors: {
        _form: ["You have successfully signed off"],
        subtitle: "Signed off!",
        status: "success",
        description: "You have successfully signed off",
      },
    };
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The deregistration failed!",
        status: "error",
        description: error.message,
      },
    };
  }
}
