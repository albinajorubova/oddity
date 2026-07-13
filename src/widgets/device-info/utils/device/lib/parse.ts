import { UAParser } from "ua-parser-js";

export const ClientUAInstance = new UAParser();

export const browser = ClientUAInstance.getBrowser();
export const cpu = ClientUAInstance.getCPU();
export const device = ClientUAInstance.getDevice();
export const engine = ClientUAInstance.getEngine();
export const os = ClientUAInstance.getOS();
export const ua = ClientUAInstance.getUA();
export const setUa = (userAgentString: string) =>
  ClientUAInstance.setUA(userAgentString);

export const getCurrentUserAgent = () => {
  const UserAgentInstance = new UAParser();

  return {
    UA: UserAgentInstance,
    browser: UserAgentInstance.getBrowser(),
    cpu: UserAgentInstance.getCPU(),
    device: UserAgentInstance.getDevice(),
    engine: UserAgentInstance.getEngine(),
    os: UserAgentInstance.getOS(),
    ua: UserAgentInstance.getUA(),
    setUserAgent: (userAgentString: string) =>
      UserAgentInstance.setUA(userAgentString),
  };
};
