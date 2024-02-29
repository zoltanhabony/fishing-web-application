"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { signIn } from "@/auth";

export async function googleLogin(){
    return await signIn("google", {callbackUrl: DEFAULT_LOGIN_REDIRECT})
}