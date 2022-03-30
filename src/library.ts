import { gsap } from 'gsap';
import mitt, { Emitter, Handler, WildcardHandler } from 'mitt';

type TEvents = {
  intersection: IntersectionObserverEntry;
};

// @ts-ignore
export default class LibraryAggregator implements Emitter<TEvents> {

    $root: HTMLDivElement = document.querySelector(".library") as HTMLDivElement;

    #emitter: Emitter<TEvents> = mitt<TEvents>();

    #currentBufferIndex: number = 0;

    constructor () {

      const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

          if ( entry.intersectionRatio < 1 ) return 
            
          this.#emitter.emit("intersection", entry);

        });
    
      }, { root: null, threshold: 1 });
      
      observer.observe(document.querySelector(".library__viewport-indicator") as Element);

    }
  
    next (): void {
  
      const booksTimeline = gsap.timeline();
  
      booksTimeline
        .to(".book__thumbnail", {
          yPercent: -150,
          duration: 1,
          ease: "power2.out",
        })
        .set(".book__thumbnail", { yPercent: 150 })
        .to(".book__thumbnail", {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
        })
  
      const textsTimeline = gsap.timeline();
  
      textsTimeline
        .to(".library__title > span", {
          yPercent: -150,
          duration: 1,
          ease: "power2.out",
        })
        .set(".library__title > span", { yPercent: 150 })
        .to(".library__title > span", {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
        })
  
      const shadesTimeline = gsap.timeline();
  
        shadesTimeline
          .to(".library__shade span", {
            yPercent: 1000,
            duration: 1.5,
            ease: "power2.out",
          })
          .set(".library__shade span", { yPercent: -1000 })
          .to(".library__shade span", {
            yPercent: 0,
            duration: 1.5,
            ease: "power2.out",
          })

      this.#currentBufferIndex += 1;
  
    }

    previous (): void {

      const booksTimeline = gsap.timeline();
  
      booksTimeline
        .to(".book__thumbnail", {
          yPercent: 150,
          duration: 1,
          ease: "power2.out",
        })
        .set(".book__thumbnail", { yPercent: -150 })
        .to(".book__thumbnail", {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
        })
  
      const textsTimeline = gsap.timeline();
  
      textsTimeline
        .to(".library__title > span", {
          yPercent: 150,
          duration: 1,
          ease: "power2.out",
        })
        .set(".library__title > span", { yPercent: -150 })
        .to(".library__title > span", {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
        })
  
      const shadesTimeline = gsap.timeline();
  
        shadesTimeline
          .to(".library__shade span", {
            yPercent: 1000,
            duration: 1.5,
            ease: "power2.out",
          })
          .set(".library__shade span", { yPercent: -1000 })
          .to(".library__shade span", {
            yPercent: 0,
            duration: 1.5,
            ease: "power2.out",
          })

      this.#currentBufferIndex -= 1;
      
    }

    isExceededLimit(): boolean {

      return this.#currentBufferIndex > 5 || this.#currentBufferIndex < 0;
      
    }

    on<Key extends keyof TEvents>(type: Key, handler: Handler<TEvents[Key]>): void;
    on(type: '*', handler: WildcardHandler<TEvents>): void;
    on(type: any, handler: any): void {
      this.#emitter.on(type, handler);
    }
  
  }