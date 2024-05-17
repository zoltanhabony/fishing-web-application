"use server";

import db from "@/lib/db";
import * as schemas from "@/helpers/schemas/validation-schema";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { access } from "fs";

interface SettingsFormState {
  errors: {
    memberId?: string[];
    accessToLogbook?: string[];
    accessToFishing?: string[];
    accessToAuthority?: string[];
    accessToCatch?: string[];
    accessToTournament?: string[];
    accessToPost?: string[];
    accessToMarker?: string[];
    accessToInspect?: string[];
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export const updateInspectorPermissions = async (
  formSate: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> => {
  const data = {
    memberId: formData.get("memberId"),
    accessToLogbook: Boolean(formData.get("accessToLogbook")),
    accessToFishing: Boolean(formData.get("accessToFishing")),
    accessToAuthority: Boolean(formData.get("accessToAuthority")),
    accessToCatch: Boolean(formData.get("accessToCatch")),
    accessToTournament: Boolean(formData.get("accessToTournament")),
    accessToPost: Boolean(formData.get("accessToPost")),
    accessToMarker: Boolean(formData.get("accessToMarker")),
    accessToInspect: Boolean(formData.get("accessToInspect")),
  };


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

  const currentUser = await db.user.findUnique({where:{
    email: session.user.email
  }, select: {
    access:{
        select:{
            accessToAuthority:true
        }
    }
  }})

  if (
    (session.user.role as UserRole) !== UserRole.OPERATOR &&
    ((session.user.role as UserRole) !== UserRole.INSPECTOR && currentUser?.access[0].accessToAuthority)
  ) {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to update a member's permissons!",
      },
    };
  }
  

  const result = schemas.inspectorPermissonSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  console.log("ez az ertek: " + result.data.accessToLogbook);

  const member = await db.member.findUnique({
    where: { id: result.data.memberId },
  });

  

  if (!member) {
    return {
      errors: {
        _form: ["Failed data modification!"],
        subtitle: "Failure to save the data!",
        status: "error",
        description: "User cannot be found!",
      },
    };
  }

  try {
    
    await db.access.update({
      where: {
        userId: member.userId
      },
      data: {
        accessToLogbook: result.data.accessToLogbook,
        accessToFishing: result.data.accessToFishing,
        accessToAuthority: result.data.accessToAuthority,
        accessToCatches: result.data.accessToCatch,
        accessToTournament: result.data.accessToTournament,
        accessToMarker: result.data.accessToMarker,
        accessToInspect: result.data.accessToInspect,
        accessToPost: result.data.accessToPost
      },
    });

    revalidatePath("/member/[id]/edit");
    
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
        description: String(error),
      },
    };
  }
};
