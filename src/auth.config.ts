import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [Google],
  session: { strategy: "jwt" }, // Force JWT everywhere
  pages: {
    signIn: "/", // Redirect users to your home page if they need to log in
  }
} satisfies NextAuthConfig