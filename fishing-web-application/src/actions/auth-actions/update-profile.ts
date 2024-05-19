"use server";

import db from "@/lib/db";
import * as schemas from "@/helpers/schemas/validation-schema";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/current-user";
import { DefaultSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface SettingsFormState {
  errors: {
    username?: string[];
    email?: string[];
    firstName?: string[];
    lastName?: string[];
    isTwoFactorEnabled?:string[]
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export const updateProfile = async (
  formSate: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> => {
  const user = (await currentUser()) as DefaultSession["user"];

  if (!user) {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "There is no valid session",
        status: "error",
        description: "There is no valid session! Sign in again! ",
      },
    };
  }

  const data = {
    username: formData.get("username"),
    isTwoFactorEnabled: Boolean(formData.get("isTwoFactorEnabled")),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName")
  };


  const result = schemas.settingsSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return {
      errors: {
        _form: ["Failed data modification!"],
        subtitle: "Failure to save the data!",
        status: "error",
        description: "User cannot be found! Sign in again! ",
      },
    };
  }

  const usernameReserved = await db.user.findUnique({
    where: {
      name: data.username as string,
      
      NOT: {
        id: dbUser.id,
      },
    },
  });

  if (usernameReserved) {
    return {
      errors: {
        username: ["Username is already used!"],
      },
    };
  }

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      name: result.data.username,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      isTwoFactorEnabled: result.data.isTwoFactorEnabled
    },
  });

  revalidatePath("/profile")

  return {
    errors: {
      _form: ["Settings updated!"],
      subtitle: "Successful data modification!",
      status: "success",
      description:
        "You have successfully changed your details! If you have also changed your email, you will receive a confirmation link to your email.",
    },
  };
};
