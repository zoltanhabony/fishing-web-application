"use server";

import * as schemas from "@/helpers/schemas/validation-schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcrypt";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

import db from "@/lib/db";
import { getTwoFactorConfirmationById } from "@/data/two-factor-confirmation";
import CredentialLoginFormState from "@/helpers/interfaces/ILoginFormState";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/utils/mail";

export async function credentialLogin(
  formSate: CredentialLoginFormState,
  formData: FormData
): Promise<CredentialLoginFormState> {
  const result = schemas.credentialLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    code: formData.get("code"),
  });


  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existingUser = await getUserByEmail(formData.get("email") as string);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      errors: {
        _form: ["Invalid Credentials"],
        subtitle: "You can not authenticate!",
        status: "error",
        description: "Invalid Credentials! Wrong email or password!",
      },
    };
  }

  const password = await bcrypt.compare(
    formData.get("password") as string,
    existingUser.password
  );

  if (!password) {
    return {
      errors: {
        _form: ["Invalid Credentials"],
        subtitle: "You can not authenticate!",
        status: "error",
        description: "Invalid Credentials! Wrong email or password!",
      },
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      formData.get("email") as string
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return {
      errors: {
        _form: ["Confirm email"],
        subtitle: "Confirmation email sent!",
        status: "information",
        description: "Confirm your email address before sign in!",
      },
    };
  }

  const code = formData.get("code") as string;

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {
          errors: {
            _form: ["Invalid Code"],
            subtitle: "You can not authenticate!",
            status: "error",
            description: "2FA code is missing!",
          },
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          errors: {
            _form: ["Invalid Code"],
            subtitle: "You can not authenticate!",
            status: "error",
            description: "You can give wrong 2FA code!",
          },
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return {
          errors: {
            _form: ["Code expired"],
            subtitle: "You can not authenticate!",
            status: "warning",
            description: "2FA code expired! Login and request a new one",
          },
        };
      }

      const existingConfirmation = await getTwoFactorConfirmationById(
        existingUser.id
      );


      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return {
        errors: {
          twoFactor: true,
        },
      };
    }
  }

  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            errors: {
              _form: ["Invalid Credentials"],
              subtitle: "You can not authenticate!",
              status: "error",
              description: "Invalid Credentials! Wrong email or password!",
            },
          };
        default:
          return {
            errors: {
              _form: ["Something went wrong!"],
              subtitle: "You can not authenticate now!",
              status: "warning",
              description:
                "Something went wrong in server side!",
            },
          };
      }
    }
    throw error;
  }

  return {
    
  };
}
