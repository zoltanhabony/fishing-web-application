import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs"
import { credentialLoginSchema } from "@/helpers/schemas/validation-schema";
import { getUserByEmail } from "./data/user";


export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    Credentials({
      async authorize(credentials) {
        const validatedFields = credentialLoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          return null ;
        }
        
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
