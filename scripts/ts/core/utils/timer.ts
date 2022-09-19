import { DebugLevelEnum, log } from "./console_wrapper";
import { now } from "./funcs";
log("timer loaded", DebugLevelEnum.DETAILED);
/**
 * A custom timeout class that can be paused.
 */
export class CustomTimeout {
  private start = 0;
  private timeout = 0;
  private finished = false;
  private running = false;

  constructor(private time: number, private func: () => any) {}

  /**
   * Runs the timer if it is not finished and it is not already running.
   */
  public set() {
    if (!this.finished && !this.running) {
      this.running = true;
      this.start = now();
      this.timeout = window.setTimeout(() => {
        this.finished = true;
        this.running = false;
        this.func();
      }, this.time);
    }
  }

  /**
   * Pauses the timer and calculates amount of time remaining.
   */
  public pause() {
    if (!this.finished && this.running) {
      clearTimeout(this.timeout);
      this.time -= now() - this.start;
      this.running = false;
    }
  }

  /**
   * Stops the timer and disallows it from running again.
   */
  public clear() {
    clearTimeout(this.timeout);
    this.finished = true;
    this.running = false;
  }
}
