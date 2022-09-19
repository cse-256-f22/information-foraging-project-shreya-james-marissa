import { data } from "./../data-log/data";
log("console wrapper loaded.", DebugLevelEnum.BASIC);
export async function error<T>(
  func: (...args: any) => T
): Promise<T | undefined> {
  return errorHO(func)();
}

export function errorHO<T>(
  func: (...args: any) => T
): (...args: any) => Promise<T | undefined> {
  return async (...args: any) => {
    try {
      return func(args);
    } catch (error) {
      data.errors.push(error);
      console.error(error);
    }
  };
}

export const enum DebugLevelEnum {
  NONE = 1,
  BASIC = 2,
  DETAILED = 3,
}

let debugLevel: DebugLevelEnum = DebugLevelEnum.BASIC;

export function setDebugLevel(level: DebugLevelEnum) {
  debugLevel = level;
}

export function log(message: string, importance: DebugLevelEnum) {
  if (debugLevel >= importance) {
    console.log(message);
  }
}
