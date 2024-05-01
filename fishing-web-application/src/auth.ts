import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import authConfig from "@/auth.config";
import { UserRole } from "@prisma/client";
import { getUserById } from "@/data/user";
import { DefaultJWT } from "next-auth/jwt";
import { getTwoFactorConfirmationById } from "./data/two-factor-confirmation";


declare module "next-auth" {
  interface Session {
    user: {
      name: string
      image: string
      email: string
      role: UserRole;
      isTwoFactorEnabled: boolean
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: UserRole;
    isTwoFactorEnabled: boolean
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });

      await db.access.create({
        data:{
          userId: user.id as string,
          accessToLogbook: false,
          accessToAuthority: false,
          accessToFishing:false,
        }
      })
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      
      if (account?.provider !== "credentials") {
        return true;
      }
      
      const existingUser = await getUserById(user.id as string)
      
      if(!existingUser?.emailVerified){
         return false
      }

      if(existingUser?.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationById(existingUser.id)
        
        if(!twoFactorConfirmation){
          return false
        }

        await db.twoFactorConfirmation.delete({where:{
          id: twoFactorConfirmation.id
        }})
     }
     
      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }
      
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name as string
        session.user.email = token.email as string
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
