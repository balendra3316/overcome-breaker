// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//       name?: string | null
//       email?: string | null
//       image?: string | null
//     }
//   }
// }








import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  // Extends the default NextAuth Session structure
  // interface Session {
  //   user: {
  //     id: string // <-- This adds the required 'id' to session.user
  //     accessToken: string // <-- Also adds the access token (used in lib/auth.ts)
  //   } & DefaultSession["user"]
  // }


  interface Session extends DefaultSession {  // ✅ Properly extends default
  user: {
    id: string
  } & DefaultSession["user"]
  accessToken?: string  // ✅ Correct - at Session level
}

  // Extends the default NextAuth User structure
  interface User extends DefaultUser {
    id: string
  }

  // Optional: Extends the Account structure to include the token
  interface Account {
    access_token: string
  }
}

declare module "next-auth/jwt" {
  // Extends the default JWT token structure
  interface JWT extends DefaultJWT {
    id: string // <-- Ensures the ID is carried over in the token
    accessToken: string
  }
}