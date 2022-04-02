import { gsap } from 'gsap';
import mitt, { Emitter, Handler, WildcardHandler } from 'mitt';

type TEvents = {
  intersection: IntersectionObserverEntry;
  next: number;
};

type TBook = {
  title: string;
  thumbnail: string;
}

// @ts-ignore
export default class LibraryAggregator implements Emitter<TEvents> {

    $root: HTMLDivElement = document.querySelector(".library") as HTMLDivElement;

    #emitter: Emitter<TEvents> = mitt<TEvents>();

    head: number = 0;

    get length () { return Math.ceil( this.books.length / 6 ) - 1 }

    // TODO: Set length to return type
    get currentBuffer (): Array<TBook> {

      const currentBuffer = this.books.slice(this.head * 6, ( this.head * 6 ) + 6);

      console.debug({ currentBuffer })

      return currentBuffer

    }

    constructor (public books: Array<TBook>) {

      const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

          if ( entry.intersectionRatio < 1 ) return 
            
          this.#emitter.emit("intersection", entry);

        });
    
      }, { root: null, threshold: 1 });
      
      observer.observe(document.querySelector(".library__viewport-indicator") as Element);

      this.renderBooks();

      this.renderTitles();

    }

    renderTitles () {

      const titles = document.querySelectorAll(".library__title > span");
  
      titles.forEach(($title, index) => {
        
        $title.innerHTML = this.currentBuffer[index].title;
      
      })

    }

    renderBooks () {

      const shelfs = [2, 3, 1, 4];
      let bookIndex = 0;

      const booksThumbnails: Array<HTMLImageElement> = Array.from(document.querySelectorAll(".book__thumbnail"));
      booksThumbnails.forEach($book__thumbnail => {
        $book__thumbnail.alt = "";
        $book__thumbnail.src = "";
      })

      for ( let shelfOrder of shelfs ) {

        if ( bookIndex >= this.currentBuffer.length ) break;

        const books: NodeListOf<HTMLImageElement> = document.querySelectorAll(`.library__shelf:nth-of-type(${shelfOrder}) .book__thumbnail`);
  
        for ( let $book of Array.from( books ) ) {
    
          $book.alt = this.currentBuffer[bookIndex].title;
          $book.src = this.currentBuffer[bookIndex].thumbnail;
  
          bookIndex += 1

        }

      }

    }
  
    next (): void {
  
      if ( this.head >= Math.ceil( this.books.length / 6 ) - 1 ) return;

      const booksTimeline = gsap.timeline();
  
      booksTimeline
        .to(".book__thumbnail", {
          yPercent: -150,
          duration: 1,
          ease: "power2.out",
          onComplete: () => this.renderBooks()
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
          onComplete: () => this.renderTitles()
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

      this.head += 1;

    }

    previous (): void {

      if ( this.head <= 0 ) return;

      const booksTimeline = gsap.timeline();
  
      booksTimeline
        .to(".book__thumbnail", {
          yPercent: 150,
          duration: 1,
          ease: "power2.out",
          onComplete: () => this.renderBooks()
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
          onComplete: () => this.renderTitles()
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

      this.head -= 1;
      
    }

    isExceededLimit(): boolean {

      return this.head >= this.length || this.head <= 0;
      
    }

    on<Key extends keyof TEvents>(type: Key, handler: Handler<TEvents[Key]>): void;
    on(type: '*', handler: WildcardHandler<TEvents>): void;
    on(type: any, handler: any): void {
      this.#emitter.on(type, handler);
    }
  
  }