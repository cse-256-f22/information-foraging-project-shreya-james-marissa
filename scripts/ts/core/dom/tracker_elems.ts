import { TopBanner } from "./banner";
import { HTMLLoc } from "./html_loc";

export class TrackerElements {
  public static setupTrackerElements() {
    // setup dom elements
    TopBanner.setup();
    HTMLLoc.setup();
  }
}
