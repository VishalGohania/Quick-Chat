import NextAuth from "next-auth";
import { authOption } from "./option";

const nextAuth = NextAuth(authOption);

export {nextAuth as GET, nextAuth as POST}