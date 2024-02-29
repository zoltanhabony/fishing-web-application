"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import * as schemas from "@/helpers/schemas/validation-schema";
import db from "@/lib/db";
import bcrypt from "bcrypt";

interface NewPasswordFormState {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
    token?: string[];
    _form?: string[];
    status?: string;
    subtitle?: string;
    description?: string;
  };
}

export async function newPassword(
  formSate: NewPasswordFormState,
  formData: FormData
): Promise<NewPasswordFormState> {
  const data = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    token: formData.get("token"),
  };

  const result = schemas.newPasswordSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const password = formData.get("password") as string;
  const token = formData.get("token") as string;

  if (!token) {
    return {
      errors: {
        _form: ["Token is missing"],
        subtitle: "Password change failed!",
        status: "error",
        description: "Token is missing! You can not change your password now!",
      },
    };
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      errors: {
        _form: ["Invalid token!"],
        subtitle: "Password change failed!",
        status: "error",
        description: "Token is invalid! You can not change your password now!",
      },
    };
  }

  const tokenExpired = new Date(existingToken.expires) < new Date();

  if (tokenExpired) {
    return {
      errors: {
        _form: ["Token has expired!"],
        subtitle: "Unable to change the password!",
        status: "warning",
        description: "Token has expired! You can not change your password now!",
      },
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      errors: {
        _form: ["Email does not exist!"],
        subtitle: "Unable to change the password!",
        status: "error",
        description:
          "No registered users with this email or user has not requested a password!",
      },
    };
  }

  const hashedPasword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      email: existingToken.email,
    },
    data: {
      password: hashedPasword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    errors: {
      _form: ["The password updated!"],
      subtitle: "The password has been changed successfully!",
      status: "success",
      description:
        "The password has been changed successfully!",
    },
  };
}
