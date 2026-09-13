import { getRequestConfig } from "next-intl/server";
import { localeMessages, routing } from "@seedstack/i18n";
import type { AppLocale } from "@seedstack/i18n";

function resolveLocale(requested: string | undefined): AppLocale {
  const supported: ReadonlyArray<AppLocale> = routing.locales;
  const match = supported.find((entry) => entry === requested);
  return match ?? routing.defaultLocale;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale);
  return { locale, messages: localeMessages[locale] };
});
