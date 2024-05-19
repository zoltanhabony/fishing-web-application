"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/tournament-schema";
import db from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";

interface CreateTournamentFormState {
  errors?: {
    fisheryAuthorityName?: string[]
    tournamentName?: string[]
    tournamentType?: string[]
    tournamentDescription?: string[]
    maxParticipants?: string[]
    startDate?: string[]
    deadline?: string[]
    fishId?: string[]
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function createTournament(
  formSate: CreateTournamentFormState,
  formData: FormData
): Promise<CreateTournamentFormState> {
  const session = await auth();

  const data = {
    fisheryAuthorityName: formData.get("fisheryAuthorityName"),
    tournamentName: formData.get("tournamentName"),
    tournamentType: formData.get("tournamentType"),
    tournamentDescription: formData.get("tournamentDescription"),
    maxParticipants: Number(formData.get("maxParticipants")),
    startDate: new Date(formData.get("startDate")!.toString()),
    deadline: new Date(formData.get("deadline")!.toString()),
    fishId: formData.get("fishId"),

  };

  //Result and Session
  const result = schemas.createTournamentSchema.safeParse(data);


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
        description: "You do not have access to create tournament!",
      },
    };
  }

  const currentAuthority = await db.fisheryAuthority.findFirst({
    where:{
        fisheryAuthorityName: result.data.fisheryAuthorityName
    }
  })

  if(!currentAuthority){
    return {
        errors: {
          fisheryAuthorityName: ["No association found in the given name!"],
          _form: ["The creation failed!"],
          subtitle: "No association found",
          status: "error",
          description: "No association found in the given name!",
        },
      };
  }

  const member = await db.member.findFirst({
    where: {
        user:{
            email: session.user.email
        },
        fisheryAuthorityId:currentAuthority.id
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
    return f.fisheryAuthority.fisheryAuthorityName === result.data.fisheryAuthorityName
  })

  if(!isMember){
    return {
        errors: {
          fisheryAuthorityName: ["You are not the operator of this association!"],
          _form: ["The creation failed!"],
          subtitle: "No access to perform the operation",
          status: "error",
          description: "You can only create a tournament for your own associations!",
        },
      };
  }

  if(result.data.startDate < result.data.deadline){
    return {
      errors: {
        deadline: ["The application deadline cannot be longer than the start time!"],
        _form: ["The creation failed!"],
        subtitle: "Incorrect date entered!",
        status: "error",
        description: "The application deadline cannot be longer than the start time!",
      },
    };
  }
  

  const fish = await db.fish.findUnique({where:{
    id: result.data.fishId?.toString()
  }})

  let fishType: string | null | undefined = fish?.id

  if(!fish){
    fishType = null
  }

  try {
    revalidatePath(`/tournament`);

    await db.tournament.create({
        data:{
            tournamentName: result.data.tournamentName,
            tournamentDescription: result.data.tournamentDescription,
            fisheryAuthorityId: currentAuthority.id,
            tournamentType: result.data.tournamentType,
            maxParticipants: result.data.maxParticipants,
            fishId: fishType,
            deadline: result.data.deadline,
            startDate: result.data.startDate,
            memberId: member.id
        }
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
