import { DebugLevelEnum, log } from "./console_wrapper";
log("funcs loaded.", DebugLevelEnum.BASIC);
// tslint:disable-next-line: no-empty
export function noop() {}
export function now(): number {
  return new Date().getTime();
}
