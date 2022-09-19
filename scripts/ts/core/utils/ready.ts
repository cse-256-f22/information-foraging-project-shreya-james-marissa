import { DebugLevelEnum, log } from "./console_wrapper";

log("ready loaded", DebugLevelEnum.BASIC);

let ready = false;

let resolveFunc: (val: boolean) => any;
let rejectFunc;
const readyPromise = new Promise((resolve: (val: boolean) => any, reject) => {
  resolveFunc = resolve;
  rejectFunc = reject;
});

document.addEventListener("DOMContentLoaded", () => {
  log("document is ready", DebugLevelEnum.DETAILED);
  ready = true;
  resolveFunc(true);
});

export function isReady() {
  return ready;
}
export function waitUntilReady(): Promise<boolean> {
  return ready ? Promise.resolve(true) : readyPromise;
}
