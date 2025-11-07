import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Adapter } from "next-auth/adapters";
import { db } from "@/db/db";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/nodemailer";

import type { NextAuthConfig } from "next-auth";

// 拼接 SMTP 服务器地址
function genEmailSmtpPServer() {
  const from = process.env.EMAIL_FROM || "";
  const host = process.env.EMAIL_HOST || "";
  const port = process.env.EMAIL_PORT || "";
  const password = process.env.EMAIL_PASSWORD || "";

  const username = from.split("@")[0];

  const server = `smtp://${username}:${password}@${host}:${port}`;
  console.log("Email Server:", server);
  return server;
}

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  adapter: PrismaAdapter(db) as Adapter,

  providers: [
    GitHub,
    // Email({
    //   server: genEmailSmtpPServer(),
    //   from: process.env.EMAIL_FROM,
    // }),
  ],

  basePath: "/auth",
  callbacks: {
    authorized({ request, auth }) {
      // const { pathname } = request.nextUrl;
      // if (pathname.startsWith('/blog_update/')) return !!auth;
      return true;
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
