import { D } from "./../core/dom/document";

export class Slideshow {
  public static setupAll() {
    Slideshow.discardAll();
    const slideshows = D.claz("slideshow");
    for (let ssIndex = 0; ssIndex < slideshows.length; ++ssIndex) {
      const elem = slideshows.item(ssIndex);
      if (elem == null) {
        continue;
      }
      Slideshow.slideshows.push(new Slideshow(elem));
    }
  }

  public static discardAll() {
    Slideshow.slideshows = [];
  }

  private static slideshows: Slideshow[] = [];

  private slideIndex = 0;
  private slideCount = 0;
  private slides: Element[] = [];
  private dots: Element[] = [];

  constructor(private outer: Element) {
    D.eachRecur(this.outer, (elem) => {
      const cList = elem.classList;
      if (cList.contains("prev-slideshow-button")) {
        D.addEventListener(elem, "click", () => this.minusSlide(1));
      } else if (cList.contains("next-slideshow-button")) {
        D.addEventListener(elem, "click", () => this.plusSlide(1));
      } else if (cList.contains("slideshow-entry")) {
        this.slides.push(elem);
      } else if (cList.contains("slideshow-dot")) {
        this.dots.push(elem);
      }
    });
    for (let i = 0; i < this.dots.length; ++i) {
      D.addEventListener(this.dots[i], "click", () => this.showSlide(i));
    }
    this.slideCount = this.slides.length;
    this.showSlide(this.slideIndex);
  }

  public plusSlide(n: number) {
    this.showSlide((this.slideIndex += n));
  }
  public minusSlide(n: number) {
    this.showSlide((this.slideIndex -= n));
  }
  public showSlide(index: number) {
    this.slideIndex = index % this.slideCount;
    this.slideIndex = Math.max(this.slideIndex, -1 * this.slideIndex);
    for (let i = 0; i < this.slides.length; ++i) {
      (this.slides[i] as HTMLElement).style.display = "none";
    }
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].classList.remove("active");
    }
    (this.slides[this.slideIndex] as HTMLElement).style.display = "block";
    this.dots[this.slideIndex].classList.add("active");
  }
}
