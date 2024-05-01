"use server";

import db from "@/lib/db";
import * as schemas from "@/helpers/schemas/validation-schema";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";
import { User } from "@nextui-org/react";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail } from "@/utils/mail";
import { revalidatePath } from "next/cache";

interface SettingsFormState {
  errors: {
    userId?: string[];
    username?: string[];
    email?: string[];
    firstName?: string[];
    lastName?: string[];
    role?: string[];
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export const updateMemberDetails = async (
  formSate: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> => {
  const data = {
    userId: formData.get("userId"),
    username: formData.get("username"),
    email: formData.get("email"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    role: formData.get("role")
  };


  const result = schemas.memberSchema.safeParse(data);


  if (!result.success) {
    console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const user = await db.user.findUnique({ where: { id: result.data.userId } });

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

  const usernameReserved = await db.user.findUnique({
    where: {
      NOT: {
        id: result.data.userId,
      },
      name: result.data.username,
    },
  });

  if (usernameReserved) {
    return {
      errors: {
        username: ["Username is already used!"],
      },
    };
  }

  if(!(result.data.role as string in UserRole)){
    return {
        errors: {
          _form: ["Failed data modification!"],
          subtitle: "Failure to save the data!",
          status: "error",
          description: "User role cannot be found!",
        },
      };
  }

  if(result.data.role as UserRole !== UserRole.USER && result.data.role as UserRole !== UserRole.INSPECTOR){
    return {
        errors: {
          role: ["User role must be USER or INSPECTOR!"],
        },
      };
  }

  const emailReserved = await db.user.findUnique({
    where: {
      NOT: {
        id: result.data.userId,
      },
      email: result.data.email,
    },
  });

  if (emailReserved) {
    return {
      errors: {
        email: ["Email is already used!"],
      },
    };
  }

  if(user.email !== result.data.email){
    const twoFactorToken = await generateTwoFactorToken(result.data.email);
    await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
  }

  try {
    await db.user.update({
      where: {
        id: result.data.userId,
      },
      data: {
        name: result.data.username,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        role: result.data.role as UserRole
      },
    });

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
