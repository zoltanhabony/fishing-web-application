"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/tournament-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface EditTournamentFormState {
  errors?: {
    id?: string[]
    isFinished?:string[]
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

export async function editTournament(
  formSate: EditTournamentFormState,
  formData: FormData
): Promise<EditTournamentFormState> {
  const session = await auth();

  const data = {
    id: formData.get("id"),
    fisheryAuthorityName: formData.get("fisheryAuthorityName"),
    tournamentName: formData.get("tournamentName"),
    tournamentType: formData.get("tournamentType"),
    tournamentDescription: formData.get("tournamentDescription"),
    maxParticipants: Number(formData.get("maxParticipants")),
    startDate: new Date(formData.get("startDate")!.toString()),
    deadline: new Date(formData.get("deadline")!.toString()),
    fishId: formData.get("fishId"),
    isFinished: Boolean(formData.get("isFinished"))
  };


  //Result and Session
  const result = schemas.editTournamentSchema.safeParse(data);

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

  const tournament = await db.tournament.findUnique({
    where:{
        id: result.data.id
    }
  })

  if(!tournament){
    return {
        errors: {
          _form: ["The modification failed!"],
          subtitle: "No torunament found",
          status: "error",
          description: "No tournament found!",
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
            email: session.user.email,
            role: "OPERATOR"
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
    id: result.data.fishId ?  result.data.fishId : ""
  }})

  let fishType: string | null | undefined = fish?.id

  if(!fish){
    fishType = null
  }
  try {
    await db.tournament.update({
      
        where:{
            id: tournament.id
        },
        data:{
            tournamentName: result.data.tournamentName,
            tournamentDescription: result.data.tournamentDescription,
            fisheryAuthorityId: currentAuthority.id,
            tournamentType: result.data.tournamentType,
            maxParticipants: result.data.maxParticipants,
            fishId: fishType,
            deadline: result.data.deadline,
            startDate: result.data.startDate,
            memberId: member.id,
            isFinished: result.data.isFinished
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
