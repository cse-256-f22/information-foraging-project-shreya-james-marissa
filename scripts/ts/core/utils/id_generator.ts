import { Elements } from "../dom/elements";
import { D } from "./../dom/document";
import { DebugLevelEnum, log } from "./console_wrapper";
log("id generator loaded", DebugLevelEnum.BASIC);
export class IDGenerator {
  public static reset() {
    IDGenerator.idCount = 0;
  }

  public static get next() {
    IDGenerator.idCount += 1;
    return IDGenerator.prefix + IDGenerator.idCount;
  }

  public static applyID(elem: Element) {
    elem.id = elem.id ? elem.id : IDGenerator.next;
  }

  /**
   * Recursively adds ids to all elements that are below the given
   * element in the heirarchy.
   *
   * @param elem - the element to start applying ids to its children.
   *                  Will not apply an id to this element.
   */
  public static applyRecur(elem: Element | string) {
    D.eachRecur(elem, this.applyID);
  }

  /**
   * Attaches ids to all html elements in the target location in the DOM that do not have ids.
   */
  public static attachIdsToAllElements() {
    IDGenerator.applyRecur(Elements.htmlLoc);
  }

  private static idCount = 0;
  private static prefix = "auto_gen_id_unq_";
}
