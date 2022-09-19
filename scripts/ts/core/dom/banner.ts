import { Router } from "../router/router";
import { DebugLevelEnum, log } from "../utils/console_wrapper";
import { History } from "./../router/history";
import { D } from "./document";
import { Elements } from "./elements";
log("banner loaded.", DebugLevelEnum.BASIC);
export class TopBanner {
  public static show() {
    TopBanner.showing = true;
    D.display(Elements.ddUp, true);
    D.display(Elements.ddDown, false);
    D.display(Elements.ddContent, true);
  }

  public static hide() {
    TopBanner.showing = false;
    D.display(Elements.ddDown, true);
    D.display(Elements.ddUp, false);
    D.display(Elements.ddContent, false);
  }

  public static doDisplayChange() {
    TopBanner.showing ? TopBanner.hide() : TopBanner.show();
  }
  public static setup() {
    D.addEventListener(Elements.ddArrow, "click", TopBanner.doDisplayChange);
  }

  private static showing = true;
}

D.addEventListener("mturk-top-banner-back", "click", (e) => {
  if (History.canBackward()) {
    Router.loadWithPathPrefix(History.backward());
  } else {
    alert("There is no page history to go back for at this time!");
  }
});
