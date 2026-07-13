import {
  gaTrackingId,
  isProdServer,
  yandexTrackingId,
} from "@/shared/config/vars";

import { GAScripts } from "./app-ga";
import { useFontsLoaded } from "./use-fonts-loaded";
import { useFoucFix } from "./use-fouc-fix";
import { YandexMetrika } from "./yandex-metrika";

/* APP HOOKS */

export const AppHooks = () => {
  useFontsLoaded();
  useFoucFix();

  if (!isProdServer) return null;

  return (
    <>
      {gaTrackingId && <GAScripts />}
      {yandexTrackingId && <YandexMetrika />}
    </>
  );
};

/* APP HOOKS */
