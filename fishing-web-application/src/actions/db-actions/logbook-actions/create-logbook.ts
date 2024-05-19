"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/logbook-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateLogbookFormState {
  errors?: {
    userName?: string[];
    authorityName?: string[];
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function createLogbook(
  formSate: CreateLogbookFormState,
  formData: FormData
): Promise<CreateLogbookFormState> {
  const session = await auth();

  const data = {
    userName: formData.get("userName"),
    authorityName: formData.get("fisheryAuthorityName"),
  };

  const result = schemas.createLogbookSchema.safeParse(data);

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

  if (session.user.role !== "OPERATOR" && session.user.role !== "INSPECTOR") {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to create angling associations!",
      },
    };
  }

  const authority = await db.fisheryAuthority.findFirst({
    where: {
      fisheryAuthorityName: data.authorityName?.toString(),
    },
  });

  if (!authority) {
    return {
      errors: {
        authorityName: ["No association found in the given name!"],
        _form: ["The creation failed!"],
        subtitle: "No association found",
        status: "error",
        description: "No association found in the given name!",
      },
    };
  }

  const user = await db.user.findUnique({
    where: {
      name: result.data.userName,
    },
  });

  if(!user){
    return {
      errors: {
        authorityName:["No user found with this name"],
        _form: ["The creation failed!"],
        subtitle: "Existing logbook",
        status: "error",
        description: "No user found with this name!",
      },
    }
  }

  if(user.role !== "USER"){
    return {
      errors: {
        userName:["No catch logbook can be created for this user"],
        _form: ["The creation failed!"],
        subtitle: "Eligibility problem",
        status: "error",
        description: "No logbook shall be established for inspectors and operators!",
      },
    }
  }

  const existingLogbook = await db.member.findFirst({
    where:{
      userId: user.id,
      NOT:{
        logbookId: null
      }
    }
  })

  if(existingLogbook !== null){
    return {
      errors: {
        userName:["The user already has a catch logbook"],
        _form: ["The creation failed!"],
        subtitle: "Existing logbook",
        status: "error",
        description: "The user already has a catch logbook",
      },
    }
  }

  try {
    revalidatePath(`/logbook`);

    const currentDate = new Date()
    const expiresYear = currentDate.getFullYear()+1
    const expiresDate = expiresYear+".01"+".01"
    
    const logbook = await db.logbook.create({
      data:{
        expiresDate: new Date(expiresDate)
      }
    })

    const member = await db.member.create({
      data:{
        userId: user.id,
        fisheryAuthorityId: authority.id,
        logbookId: logbook.id
      }
    })

    await db.access.update({
      where:{
        userId:user.id
      },
      data:{
        accessToLogbook: true,
        accessToFishing:true
      }
    })

    return {
      errors: {
        _form: ["The logbook created successfully"],
        subtitle: "Successfull creation!",
        status: "success",
        description: "The logbook created successfully",
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
