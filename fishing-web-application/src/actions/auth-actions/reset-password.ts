"use server";

import * as schemas from "@/helpers/schemas/validation-schema";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/utils/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

interface ResetPasswordFormState {
  errors?: {
    email?: string[];
    password?: string[];
    code?: string[];
    _form?: string[];
    twoFactor?: boolean;
    status?: string;
    subtitle?: string;
    description?: string;
  };
}

export async function resetPassword(
  formSate: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const result = schemas.passwordResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const email = formData.get("email") as string;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        _form: ["Email not found!"],
        subtitle: "You can not reset your password",
        status: "error",
        description: "No registered users with this email!",
      },
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    errors: {
      _form: ["Password reset email sent!"],
      subtitle: "The new password request was successful",
      status: "success",
      description: "Check your email account and use the verification link to change your password",
    },
  };
}
