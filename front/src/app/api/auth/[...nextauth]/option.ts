import { LOGIN_URL } from "@/lib/apiEndPoints";
import axios, { AxiosError } from "axios";
import { Account, AuthOptions, ISODateString } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString
}

export interface CustomUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string | null;
  token?: string | null;
}

export const authOption: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }: {user: CustomUser, account: Account | null}) {
      try {
        console.log("user data is ", user);
        console.log("user account is ", account);
        
        const payload = {
          email: user.email,
          name: user.name,
          oauth_id: account?.providerAccountId,
          provider: account?.provider,
          image: user?.image
        }
        const { data } = await axios.post(LOGIN_URL, payload, 
          // headers: {
          //   'Content-Type': 'application/json'
          // },
          // timeout: 30000
        );
        console.log("Backend response:", data);

        user.id = data?.user?.id.toString();
        user.token = data?.user?.token;
        user.provider = data?.user?.provider;
        
        return true
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    // async session({ session, token }) {
    //   try {
    //     if(token?.user) {
    //       session.user = token.user as CustomUser
    //     }
    //     return session;
    //   } catch (error: any) {
    //     console.error("Session callback error:", error);
    //     return session;
    //   }
    // },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    },
    async jwt({ token, user }) {
      try {
        if(user) {
          token.user = user;
        }
        return token;
      } catch (error: any) {
        console.error("JWT callback error:", error);
        return token;
      }
      
    }
  },
  debug: true,
}