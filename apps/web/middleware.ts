import createMiddleware from "next-intl/middleware";
import { routing } from "@seedstack/i18n";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
