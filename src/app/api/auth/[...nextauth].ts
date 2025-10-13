import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { authOptions } from "@/lib/auth";

export default NextAuth(authOptions);
