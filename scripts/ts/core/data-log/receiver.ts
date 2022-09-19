import { DebugLevelEnum, log } from "../utils/console_wrapper";
import { isTrackerEvent, TrackerEvent } from "./event";
log("receiver loaded.", DebugLevelEnum.BASIC);
export class EventReceiver {
  private map = new Map<string, (event: TrackerEvent) => void>();
  private emitter = new EventTarget();

  public register(eventType: string, callback?: (event: TrackerEvent) => void) {
    this.emitter.addEventListener(eventType, (event: Event) => {
      const trackEv = ((event as unknown) as CustomEvent)
        .detail as TrackerEvent;
      if (isTrackerEvent(trackEv) && callback) {
        callback(trackEv);
      }
    });
    if (callback) {
      this.map.set(eventType, callback);
    }
  }

  public doEvent(event: TrackerEvent) {
    const callback = this.map.get("" + event.action);
    if (callback) {
      callback(event);
    }
  }
}
