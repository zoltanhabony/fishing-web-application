"use server";
import db from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export async function verifyEmail(
  formSate: any,
  formData: FormData
): Promise<any> {
  const token = formData.get("token");

  if (!token) {
    return {
      errors: {
        _form: ["Token is missing"],
        subtitle: "Verification failed!",
        status: "error",
        description: "Token is missing! You can not verfify your email now!",
      },
    };
  }

  const existingToken = await getVerificationTokenByToken(token.toString());
  if (!existingToken) {
    return {
      errors: {
        _form: ["Token does not exsist!"],
        subtitle: "Verification failed!",
        status: "error",
        description: "Invalid token! You can not verfify your email now!",
      },
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      errors: {
        _form: ["Token has expired!"],
        subtitle: "Verification failed!",
        status: "warning",
        description:
          "Token is valid, but has expired! You can not verfify your email now!",
      },
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      errors: {
        _form: ["Email does not exsist!"],
        subtitle: "Verification failed!",
        status: "error",
        description: "Invalid email! You can not verfify your email now!",
      },
    };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    errors: {
      _form: ["Verification success!"],
      subtitle: "Successful verify your email!",
      status: "success",
      description:
        "Verification successful, go back to login page and sign in!",
    },
  };
}
