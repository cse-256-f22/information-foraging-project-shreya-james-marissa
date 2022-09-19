import { DebugLevelEnum, log } from "../utils/console_wrapper";
import { now } from "../utils/funcs";
log("event loaded.", DebugLevelEnum.BASIC);
export const enum ActionEnum {
  CLICK = "click",
  BUTTON = "button",
  SCROLL = "scroll",
  HISTORY = "history",
}

export interface TrackerEvent {
  action: string;
  time: number;
}

export function objectToTrackerEvent(obj: any, action: string) {
  obj.action = action;
  obj.time = now();
}

export function isTrackerEvent(obj: any): obj is TrackerEvent {
  return obj.action !== undefined && obj.time !== undefined;
}

export class BaseTrackerEvent<T> implements TrackerEvent {
  public custEv: CustomEvent;
  public action: string;
  public time: number;
  constructor(action: string, eventInitDict?: CustomEventInit<T> | undefined) {
    this.custEv = new CustomEvent(action, eventInitDict);
    this.action = action;
    this.time = now();
  }

  public get detail() {
    return this.custEv.detail;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ClickEvent extends BaseTrackerEvent<{
  x: number;
  y: number;
  id: string;
}> {
  constructor(
    x: number,
    y: number,
    id: string,
    eventInitDict?:
      | CustomEventInit<{ x: number; y: number; id: string }>
      | undefined
  ) {
    super(ActionEnum.CLICK, eventInitDict);
    this.detail.x = x;
    this.detail.y = y;
    this.detail.id = id;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ButtonEvent extends BaseTrackerEvent<{ key: string; id: string }> {
  constructor(
    key: string,
    id: string,
    eventInitDict?: CustomEventInit<{ key: string; id: string }> | undefined
  ) {
    super(ActionEnum.CLICK, eventInitDict);
    this.detail.key = key;
    this.detail.id = id;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class HistoryEvent extends BaseTrackerEvent<{
  url: string;
  extra?: any;
}> {
  constructor(
    url: string,
    extra?: any,
    eventInitDict?: CustomEventInit<{ url: string }> | undefined
  ) {
    super(ActionEnum.HISTORY, eventInitDict);
    this.detail.url = url;
    this.detail.extra = extra;
  }
}
