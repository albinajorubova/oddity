import { getNavigatorInstance, isIOS13Check, setDefaults } from "../utils";
import { BrowserTypes, DeviceTypes, OsTypes } from "./constants";

export const isMobileType = ({ type }: { type?: string }) =>
  type === DeviceTypes.Mobile;
export const isTabletType = ({ type }: { type?: string }) =>
  type === DeviceTypes.Tablet;
export const isMobileAndTabletType = ({ type }: { type?: string }) =>
  type === DeviceTypes.Mobile || type === DeviceTypes.Tablet;
export const isSmartTVType = ({ type }: { type?: string }) =>
  type === DeviceTypes.SmartTv;
export const isBrowserType = ({ type }: { type?: string }) =>
  type === DeviceTypes.Browser;
export const isWearableType = ({ type }: { type?: string }) =>
  type === DeviceTypes.Wearable;
export const isConsoleType = ({ type }: { type?: string }) =>
  type === DeviceTypes.Console;
export const isEmbeddedType = ({ type }: { type?: string }) =>
  type === DeviceTypes.Embedded;
export const getMobileVendor = ({ vendor }: { vendor?: string }) =>
  setDefaults(vendor);
export const getMobileModel = ({ model }: { model?: string }) =>
  setDefaults(model);
export const getDeviceType = ({ type }: { type?: string }) =>
  setDefaults(type, "browser");

// os types
export const isAndroidType = ({ name }: { name?: string }) =>
  name === OsTypes.Android;
export const isWindowsType = ({ name }: { name?: string }) =>
  name === OsTypes.Windows;
export const isMacOsType = ({ name }: { name?: string }) =>
  name === OsTypes.MAC_OS;
export const isWinPhoneType = ({ name }: { name?: string }) =>
  name === OsTypes.WindowsPhone;
export const isIOSType = ({ name }: { name?: string }) => name === OsTypes.IOS;
export const getOsVersion = ({ version }: { version?: string }) =>
  setDefaults(version);
export const getOsName = ({ name }: { name?: string }) => setDefaults(name);

// browser types
export const isChromeType = ({ name }: { name?: string }) =>
  name === BrowserTypes.Chrome;
export const isFirefoxType = ({ name }: { name?: string }) =>
  name === BrowserTypes.Firefox;
export const isChromiumType = ({ name }: { name?: string }) =>
  name === BrowserTypes.Chromium;
export const isEdgeType = ({ name }: { name?: string }) =>
  name === BrowserTypes.Edge;
export const isYandexType = ({ name }: { name?: string }) =>
  name === BrowserTypes.Yandex;
export const isSafariType = ({ name }: { name?: string }) =>
  name === BrowserTypes.Safari || name === BrowserTypes.MobileSafari;
export const isMobileSafariType = ({ name }: { name?: string }) =>
  name === BrowserTypes.MobileSafari;
export const isOperaType = ({ name }: { name?: string }) =>
  name === BrowserTypes.Opera;
export const isIEType = ({ name }: { name?: string }) =>
  name === BrowserTypes.InternetExplorer || name === BrowserTypes.Ie;
export const isMIUIType = ({ name }: { name?: string }) =>
  name === BrowserTypes.MIUI;
export const isSamsungBrowserType = ({ name }: { name?: string }) =>
  name === BrowserTypes.SamsungBrowser;
export const getBrowserFullVersion = ({ version }: { version?: string }) =>
  setDefaults(version);
export const getBrowserVersion = ({ major }: { major?: string }) =>
  setDefaults(major);
export const getBrowserName = ({ name }: { name?: string }) =>
  setDefaults(name);

// engine types
export const getEngineName = ({ name }: { name?: string }) => setDefaults(name);
export const getEngineVersion = ({ version }: { version?: string }) =>
  setDefaults(version);

export const isElectronType = (): boolean => {
  const nav = getNavigatorInstance() as Navigator & { userAgent?: string };
  const ua = nav && nav.userAgent && nav.userAgent.toLowerCase();
  return typeof ua === "string" ? /electron/.test(ua) : false;
};

export const isEdgeChromiumType = (ua?: string) =>
  typeof ua === "string" && ua.indexOf("Edg/") !== -1;

export const getIOS13 = (): boolean => {
  const nav = getNavigatorInstance() as Navigator & {
    platform?: string;
    maxTouchPoints?: number;
    MSStream?: unknown;
  };
  return (
    !!nav &&
    (/iPad|iPhone|iPod/.test(nav.platform || "") ||
      (nav.platform === "MacIntel" && (nav.maxTouchPoints || 0) > 1)) &&
    !(window as any).MSStream
  );
};
export const getIPad13 = () => isIOS13Check("iPad");
export const getIphone13 = () => isIOS13Check("iPhone");
export const getIPod13 = () => isIOS13Check("iPod");
export const getUseragent = (userAg?: string) => setDefaults(userAg);
