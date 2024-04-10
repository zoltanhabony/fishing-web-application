"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/logbook-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface ModifyLogbookFormState {
  errors?: {
    id?: string[]
    userName?: string[];
    authorityName?: string[];
    expiresDate?:string[]
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function modifyLogbook(
  formSate: ModifyLogbookFormState,
  formData: FormData
): Promise<ModifyLogbookFormState> {
  const session = await auth();

  const data = {
    id: formData.get("id"),
    userName: formData.get("userName"),
    authorityName: formData.get("fisheryAuthorityName"),
    expiresDate: new Date(formData.get("expiresDate")!.toString())
  };

  const result = schemas.modifyLogbookSchema.safeParse(data);

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

  const logbook = await db.logbook.findUnique({
    where: {
      id: result.data.id,
    },
    select:{
      id:true,
      member:{
        select:{
          user:{
            select:{
              name: true
            }
          }
        }
      }
    }
  })


  if(!logbook) {
    return {
      errors: {
        _form: ["The logbook does not exist"],
        subtitle: "The logbook you want to modify does not exist!",
        status: "error",
        description: "The logbook does not exist!",
      },
    };
  }

  const logbookOwner = logbook.member?.user.name

  const user = await db.user.findUnique({
    where: {
      name: result.data.userName,
    },
  });

  if(!user){
    return {
      errors: {
        userName:["No user found with this name"],
        _form: ["The modification failed!"],
        subtitle: "Existing logbook",
        status: "error",
        description: "No user found with this name!",
      },
    }
  }

  const existingLogbook = await db.member.findFirst({
    where:{
      userId: user.id,
      NOT:{
        logbookId: null,
      }
    }
  })
  

  if(existingLogbook !== null && user.name !== logbookOwner){
    return {
      errors: {
        userName:["The user already has a catch logbook"],
        _form: ["The modification failed!"],
        subtitle: "Existing logbook",
        status: "error",
        description: "The user already has a catch logbook",
      },
    }
  }

  if(result.data.expiresDate < new Date()) {
    return {
      errors: {
        expiresDate:["Incorrect date entered, you cannot enter a past date!"],
        _form: ["The modification failed!"],
        subtitle: "You cannot enter a past date!",
        status: "error",
        description: "The date must be greater than today's date!",
      },
    }
  }

  const authority = await db.fisheryAuthority.findFirst({
    where: {
      fisheryAuthorityName: result.data.authorityName,
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

  try {

    await db.logbook.update({
      where:{
        id: result.data.id
      },
      data:{
        expiresDate: result.data.expiresDate
      }
    })

    await db.member.update({
      where:{
        logbookId: result.data.id,
      },
      data:{
        userId: user.id,
        fisheryAuthorityId: authority.id
      }
    })
    revalidatePath(`/logbook`);

    

    return {
      errors: {
        _form: ["The logbook has been successfully modified"],
        subtitle: "Successfull modification!",
        status: "success",
        description: "The logbook has been successfully modified",
      },
    };
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The modification failed!",
        status: "error",
        description: error.message,
      },
    };
  }
}
