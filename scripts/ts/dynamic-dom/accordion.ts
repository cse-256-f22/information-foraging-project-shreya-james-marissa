import { D } from "./../core/dom/document";

export class Accordion {
  public static setupAll() {
    Accordion.discardAll();
    const accordions = D.claz("accordion");
    for (let accIndex = 0; accIndex < accordions.length; ++accIndex) {
      const elem = accordions.item(accIndex);
      if (elem == null) {
        continue;
      }
      Accordion.accordions.push(new Accordion(elem));
    }
  }

  public static discardAll() {
    Accordion.accordions = [];
  }

  private static accordions: Accordion[] = [];

  constructor(private outer: Element) {
    D.addEventListener(outer, "click", () => {
      /* Toggle between adding and removing the "active" class,
                to highlight the button that controls the panel */
      this.outer.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      const panel = this.outer.nextElementSibling as HTMLElement;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
}
