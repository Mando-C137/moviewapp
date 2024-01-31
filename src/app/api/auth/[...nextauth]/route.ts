import NextAuth from "next-auth/next";
import { authOptions } from "../../../../server/auth";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
