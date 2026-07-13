import { getCurrentUserAgent } from "./parse";
import * as types from "./types";

export interface DeviceInfo {
  isSmartTV: boolean;
  isConsole: boolean;
  isWearable: boolean;
  isEmbedded: boolean;
  isMobileSafari: boolean;
  isChromium: boolean;
  isMobile: boolean;
  isMobileOnly: boolean;
  isTablet: boolean;
  isBrowser: boolean;
  isDesktop: boolean;
  isAndroid: boolean;
  isWinPhone: boolean;
  isIOS: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isOpera: boolean;
  isIE: boolean;
  osVersion: string;
  osName: string;
  fullBrowserVersion: string;
  browserVersion: string;
  browserName: string;
  mobileVendor: string;
  mobileModel: string;
  engineName: string;
  engineVersion: string;
  getUA: string;
  isYandex: boolean;
  isEdge: boolean;
  deviceType: string;
  isIOS13: boolean;
  isIPad13: boolean;
  isIPhone13: boolean;
  isIPod13: boolean;
  isElectron: boolean;
  isEdgeChromium: boolean;
  isLegacyEdge: boolean;
  isWindows: boolean;
  isMacOs: boolean;
  isMIUI: boolean;
  isSamsungBrowser: boolean;
  isIpadPro: boolean;
  isReducedMotion: boolean;
  isWebGL: boolean;
  current?: string;
}

export const getDeviceObject = (): DeviceInfo => {
  const { device, browser, engine, ua, os } = getCurrentUserAgent();

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error
    navigator.msMaxTouchPoints > 0;

  const isSafari = types.isSafariType(browser);

  const isIpadPro = types.isBrowserType(device) && isSafari && isTouchDevice;

  const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const isReducedMotion = reduceMotionQuery.matches;

  const isSmartTV = types.isSmartTVType(device);
  const isConsole = types.isConsoleType(device);
  const isWearable = types.isWearableType(device);
  const isEmbedded = types.isEmbeddedType(device);
  const isMobileSafari = types.isMobileSafariType(browser) || types.getIPad13();
  const isChromium = types.isChromiumType(browser);

  const isMobile =
    types.isMobileAndTabletType(device) || types.getIPad13() || isIpadPro;

  const isMobileOnly = types.isMobileType(device);
  const isTablet = types.isTabletType(device) || types.getIPad13() || isIpadPro;
  const isBrowser = types.isBrowserType(device);
  const isDesktop = types.isBrowserType(device) && !isIpadPro;
  const isAndroid = types.isAndroidType(os);
  const isWinPhone = types.isWinPhoneType(os);
  const isIOS = types.isIOSType(os) || types.getIPad13();
  const isChrome = types.isChromeType(browser);
  const isFirefox = types.isFirefoxType(browser);
  const isOpera = types.isOperaType(browser);
  const isIE = types.isIEType(browser);
  const osVersion = types.getOsVersion(os);
  const osName = types.getOsName(os);
  const fullBrowserVersion = types.getBrowserFullVersion(browser);
  const browserVersion = types.getBrowserVersion(browser);
  const browserName = types.getBrowserName(browser);
  const mobileVendor = types.getMobileVendor(device);
  const mobileModel = types.getMobileModel(device);
  const engineName = types.getEngineName(engine);
  const engineVersion = types.getEngineVersion(engine);
  const getUA = types.getUseragent(ua);
  const isEdge = types.isEdgeType(browser) || types.isEdgeChromiumType(ua);
  const isYandex = types.isYandexType(browser);
  const deviceType = types.getDeviceType(device);
  const isIOS13 = types.getIOS13();
  const isIPad13 = types.getIPad13();
  const isIPhone13 = types.getIphone13();
  const isIPod13 = types.getIPod13();
  const isElectron = types.isElectronType();
  const isEdgeChromium = types.isEdgeChromiumType(ua);
  const isLegacyEdge =
    types.isEdgeType(browser) && !types.isEdgeChromiumType(ua);
  const isWindows = types.isWindowsType(os);
  const isMacOs = types.isMacOsType(os);
  const isMIUI = types.isMIUIType(browser);
  const isSamsungBrowser = types.isSamsungBrowserType(browser);
  const isWebGL = isDesktop && !isReducedMotion;

  return {
    isSmartTV,
    isConsole,
    isWearable,
    isEmbedded,
    isMobileSafari,
    isChromium,
    isMobile,
    isMobileOnly,
    isTablet,
    isBrowser,
    isDesktop,
    isAndroid,
    isWinPhone,
    isIOS,
    isChrome,
    isFirefox,
    isSafari,
    isOpera,
    isIE,
    osVersion,
    osName,
    fullBrowserVersion,
    browserVersion,
    browserName,
    mobileVendor,
    mobileModel,
    engineName,
    engineVersion,
    getUA,
    isYandex,
    isEdge,
    deviceType,
    isIOS13,
    isIPad13,
    isIPhone13,
    isIPod13,
    isElectron,
    isEdgeChromium,
    isLegacyEdge,
    isWindows,
    isMacOs,
    isMIUI,
    isSamsungBrowser,
    isIpadPro,
    isReducedMotion,
    isWebGL,
  };
};
