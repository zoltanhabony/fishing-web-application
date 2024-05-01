"use server";

import db from "@/lib/db";
import * as schemas from "@/helpers/schemas/validation-schema";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface SettingsFormState {
  errors: {
    userId?: string[];
    accessToAuthority?: string[],
    accessToLogbook?: string[],
    accessToFishing?:string[],
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export const updateMemberPermissions = async (
  formSate: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> => {
  const data = {
    userId: formData.get("userId"),
    accessToAuthority: Boolean(formData.get("accessToAuthority")),
    accessToLogbook: Boolean(formData.get("accessToLogbook")),
    accessToFishing: Boolean(formData.get("accessToFishing")),
  };

  const session = await auth()



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

  if (session.user.role as UserRole !== UserRole.OPERATOR && session.user.role as UserRole !== UserRole.INSPECTOR) {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to update a member's permissons!",
      },
    };
  }

  const result = schemas.memberPermissonSchema.safeParse(data);


  if (!result.success) {
    console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  console.log(data)

  const user = await db.user.findUnique({ where: { id: result.data.userId }, include: {
    access: {
      select: {
        accessToAuthority:true,
        accessToFishing:true,
        accessToLogbook:true,
      },
    },
  },});

  if (!user) {
    return {
      errors: {
        _form: ["Failed data modification!"],
        subtitle: "Failure to save the data!",
        status: "error",
        description: "User cannot be found!",
      },
    };
  }

  //console.log(result.data)

  try {

    await db.access.update({
        where: {
            userId: result.data.userId
        },
        data:{
            accessToAuthority: result.data.accessToAuthority,
            accessToLogbook: result.data.accessToLogbook,
            accessToFishing: result.data.accessToFishing
        }
    })
    
    revalidatePath("/member/[id]/edit")
    return {
      errors: {
        _form: ["Settings updated!"],
        subtitle: "Successful data modification!",
        status: "success",
        description:
          "You have successfully changed your details! If you have also changed your email, you will receive a confirmation link to your email.",
      },
    };
  } catch (error) {
    return {
      errors: {
        _form: ["Failed data modification!"],
        subtitle: "Failure to save the data!",
        status: "error",
        description: String(error)
      },
    };
  }
};
