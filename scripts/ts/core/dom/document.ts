import { DebugLevelEnum, error, log } from "./../utils/console_wrapper";
log("document loaded.", DebugLevelEnum.BASIC);
export class D {
  public static doc: Document = document;

  public static elem(elem: Element | string): Element {
    if (typeof elem === "string") {
      return D.id(elem);
    } else {
      return elem as Element;
    }
  }

  public static display(elem: Element | string, show: boolean): void {
    elem = D.elem(elem);
    if (show) {
      elem.classList.remove("none");
      elem.classList.add("display");
    } else {
      elem.classList.remove("display");
      elem.classList.add("none");
    }
  }

  public static id(id: string): HTMLElement {
    const element = D.doc.getElementById(id);
    if (element === null) {
      throw new Error(`Element was not found, id: <${id}>.`);
    } else {
      return element;
    }
  }
  public static claz(claz: string): HTMLCollectionOf<Element> {
    return D.doc.getElementsByClassName(claz);
  }
  public static tag(tag: string): HTMLCollectionOf<Element> {
    return D.doc.getElementsByTagName(tag);
  }
  public static image(id: string, url: string): void {
    error(() => D.id(id).setAttribute("src", url));
  }

  public static addEventListener(
    elem: Element | string,
    type: string,
    listener: (e: Event) => any
  ) {
    elem = this.elem(elem);
    const wrapperFunc = (e: Event) => {
      try {
        listener(e);
      } catch (err) {
        console.error(err);
      }
    };
    (elem as Element).addEventListener(type, wrapperFunc);
    return wrapperFunc;
  }

  public static each(elem: Element | string, apply: (node: Element) => any) {
    elem = this.elem(elem);
    const children = elem.children;
    for (let i = 0; i < children.length; i++) {
      apply(children[i]);
    }
  }

  public static eachRecur(
    elem: Element | string,
    apply: (node: Element) => any
  ) {
    elem = this.elem(elem);
    const children = elem.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      apply(child);
      D.eachRecur(child, apply);
    }
  }

  public static create<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
  ): HTMLElementTagNameMap[K] {
    return document.createElement(tagName, options);
  }
}
