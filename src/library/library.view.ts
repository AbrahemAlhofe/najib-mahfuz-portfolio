import mitt, { Emitter, Handler, WildcardHandler } from "mitt";
import { TEvents, TBook } from "./types";
import { gsap } from 'gsap';
import ViewportAggregator from "../viewport";

// @ts-ignore
export class LibraryView implements Emitter<TEvents> {

    $root: HTMLDivElement = document.querySelector(".library") as HTMLDivElement;
  
    #emitter: Emitter<TEvents> = mitt<TEvents>();

    #viewport: ViewportAggregator = new ViewportAggregator();
  
    constructor () {
  
      const observer = new IntersectionObserver((entries) => {
  
        entries.forEach(entry => {
  
          if ( !entry.isIntersecting ) return 
            
          this.#emitter.emit("intersection", entry);
  
        });
    
      }, { root: null, threshold: 1 });
      
      observer.observe(document.querySelector(".library__viewport-indicator") as Element);
  
      const $books: NodeListOf<HTMLElement> = this.$root.querySelectorAll(".book");
  
      $books.forEach( (book: HTMLElement) => {
  
        book.addEventListener("click", () => {
  
          this.#emitter.emit("book:click", book as HTMLDivElement);
  
        })
  
      })

    }

    async renderShelves (buffer: Array<TBook>) {

      const $titles = document.querySelectorAll(".library__title > span");
  
      $titles.forEach(($title, index) => {
  
        if ( buffer[index] ) {
  
          $title.innerHTML = buffer[index].title;
  
        } else {
  
          $title.innerHTML = "";
  
        }
      
      })

      const booksThumbnails: Array<HTMLImageElement> = Array.from(document.querySelectorAll(".book__thumbnail"));
      booksThumbnails.forEach($book__thumbnail => {
        $book__thumbnail.alt = "";
        $book__thumbnail.src = "";
      })
      
      const shelves = [2, 3, 1, 4];
      let bookIndex = 0;
      
      for ( let shelfOrder of shelves ) {
  
        if ( bookIndex >= buffer.length ) break;
  
        const $books: NodeListOf<HTMLImageElement> = document.querySelectorAll(`.library__shelf:nth-of-type(${shelfOrder}) .book__thumbnail`);
  
        for ( let $book of Array.from( $books ) ) {
    
          if ( bookIndex >= buffer.length ) break;

          $book.alt = buffer[bookIndex].title;
          $book.src = buffer[bookIndex].thumbnail;
          $book.parentElement?.setAttribute("data-index", bookIndex.toString());
  
          bookIndex += 1
  
        }
  
      }

      return Promise.resolve();

    }
  
    async renderInspector (selectedBook: TBook) {

      const isSmallDevice = window.matchMedia("(max-width: 1024px)").matches;
      
      const $inspector = document.querySelector(".library .inspector") as HTMLElement;
      const $inspector__title = $inspector.querySelector(".inspector__title span") as HTMLElement;
      const $inspector__paragraph = $inspector.querySelector(".inspector__paragraph span") as HTMLElement;
      const $inspector__thumbnail = $inspector.querySelector(".inspector__thumbnail img") as HTMLImageElement;
  
      if ( !isSmallDevice ) {

        gsap.set($inspector__title, { yPercent: 110 });
        gsap.set($inspector__paragraph, { yPercent: 110 });
        gsap.set($inspector__thumbnail, { yPercent: 110 });

      }

      $inspector.classList.add("inspector--open");
  
      $inspector__title.innerText = selectedBook.title;
  
      $inspector__paragraph.innerText = selectedBook.description;
  
      $inspector__thumbnail.src = selectedBook.thumbnail;

      let rotates = 1;

      const onSwipeLeft = () => rotates -= 1;
      
      const onSwipeRight = () => rotates += 1;

      const onSwipe = () => {
        
        gsap.to($inspector, { rotateY : `${rotates * 180}deg` })
        
        console.log("onSwipe")
        
      }

      if ( this.isSmallDevice ) {

        this.#viewport.on("swipe:horizontal", onSwipe);
  
        this.#viewport.on("swipe:left", onSwipeLeft);
  
        this.#viewport.on("swipe:right", onSwipeRight)

        $inspector!.addEventListener("click", () => { onSwipeLeft(); onSwipe() });
          
        this.#viewport.on("swipe:vertical", () => {
          
          this.#viewport.off("swipe:left", onSwipeLeft);
  
          this.#viewport.off("swipe:right", onSwipeRight);
  
          this.#viewport.off("swipe:horizontal", onSwipe);

        })

      }
  
    }
  
    async showInspector () {

      const $inspector = document.querySelector(".library .inspector") as HTMLElement;
      const $inspector__title = $inspector.querySelector(".inspector__title span") as HTMLElement;
      const $inspector__paragraph = $inspector.querySelector(".inspector__paragraph span") as HTMLElement;
      const $inspector__thumbnail = $inspector.querySelector(".inspector__thumbnail img") as HTMLImageElement;
      
      if ( this.isSmallDevice ) {

        gsap.timeline()
          .to($inspector__thumbnail, { yPercent: 0 })
          .to($inspector, { rotateY: 180 })

      } else {

        gsap.to($inspector__title, { yPercent: 0 });       
        gsap.to($inspector__thumbnail, { yPercent: 0 });   
        gsap.to($inspector__paragraph, { yPercent: 0 });

      }

    }

    async hideInspector () {
  
      const $inspector = document.querySelector(".library .inspector") as HTMLElement;
      const $inspector__thumbnail = $inspector.querySelector(".inspector__thumbnail img") as HTMLImageElement;
      const $inspector__title = $inspector.querySelector(".inspector__title span") as HTMLElement;
      const $inspector__paragraph = $inspector.querySelector(".inspector__paragraph span") as HTMLElement;

      return new Promise((resolve, reject) => {
  
        const onComplete = () => {

          $inspector.classList.remove("inspector--open");

          resolve(undefined);

        }
        
        try {
          
          const isSmallDevice = window.matchMedia("(max-width: 1024px)").matches;

          if ( isSmallDevice ) {
            
            gsap.timeline()
              .to($inspector__thumbnail, { yPercent: 110, onComplete })
              .to($inspector, { rotateY: 0 })
    
          } else {

            gsap.to($inspector__title, { yPercent: 110 }); 
            gsap.to($inspector__paragraph, { yPercent: 110 });
            gsap.to($inspector__thumbnail, { yPercent: 110, onComplete })

          }

        } catch (error) {
    
          reject(error);
    
        }
        
      })
      
  
    }

    fadeUp () {

      return new Promise(( resolve, reject ) => {
        
        try {
          
          const booksTimeline = gsap.timeline();
      
          booksTimeline
            .to(".book__thumbnail", {
              yPercent: -150,
              duration: 1,
              ease: "power2.out",
              onComplete: resolve
            })

          const textsTimeline = gsap.timeline();
      
          textsTimeline
            .to(".library__title > span", {
              yPercent: -150,
              duration: 1,
              ease: "power2.out"
            })
      
          const shadesTimeline = gsap.timeline();
      
            shadesTimeline
              .to(".library__shade span", {
                yPercent: 1000,
                duration: 1.5,
                ease: "power2.out",
              })
          
        } catch (error) {

          reject(error);

        }

      })

    }

    appearUp () {

      return new Promise((resolve, reject) => {

        try {

          const booksTimeline = gsap.timeline();
  
          booksTimeline
            .set(".book__thumbnail", { yPercent: 150 })
            .to(".book__thumbnail", {
              yPercent: 0,
              duration: 1,
              ease: "power2.out",
              onComplete: resolve
            })
      
          const textsTimeline = gsap.timeline();
      
          textsTimeline
            .set(".library__title > span", { yPercent: 150 })
            .to(".library__title > span", {
              yPercent: 0,
              duration: 1,
              ease: "power2.out",
            })

          const shadesTimeline = gsap.timeline();
    
          shadesTimeline
            .set(".library__shade span", { yPercent: -1000 })
            .to(".library__shade span", {
              yPercent: -100,
              duration: 1.5,
              ease: "power2.out"
            })

        } catch (error) {

          reject(error);

        }

      })

    }

    fadeDown () {

      return new Promise(( resolve, reject ) => {
        
        try {
          
          const booksTimeline = gsap.timeline();
      
          booksTimeline
            .to(".book__thumbnail", {
              yPercent: 150,
              duration: 1,
              ease: "power2.out",
              onComplete: resolve
            })

          const textsTimeline = gsap.timeline();
      
          textsTimeline
            .to(".library__title > span", {
              yPercent: 150,
              duration: 1,
              ease: "power2.out"
            })
      
          const shadesTimeline = gsap.timeline();
      
            shadesTimeline
              .to(".library__shade span", {
                yPercent: 1000,
                duration: 1.5,
                ease: "power2.out",
              })
          
        } catch (error) {

          reject(error);

        }

      })

    }

    appearDown () {

      return new Promise((resolve, reject) => {

        try {

          const booksTimeline = gsap.timeline();
  
          booksTimeline
            .set(".book__thumbnail", { yPercent: -150 })
            .to(".book__thumbnail", {
              yPercent: 0,
              duration: 1,
              ease: "power2.out",
              onComplete: resolve
            })
      
          const textsTimeline = gsap.timeline();
      
          textsTimeline
            .set(".library__title > span", { yPercent: -150 })
            .to(".library__title > span", {
              yPercent: 0,
              duration: 1,
              ease: "power2.out",
            })

          const shadesTimeline = gsap.timeline();
    
          shadesTimeline
            .set(".library__shade span", { yPercent: -1000 })
            .to(".library__shade span", {
              yPercent: -100,
              duration: 1.5,
              ease: "power2.out"
            })

        } catch (error) {

          reject(error);

        }

      })

    }

    get isSmallDevice (): boolean {
      return window.matchMedia("(max-width: 1024px)").matches
    }

    on<Key extends keyof TEvents>(type: Key, handler: Handler<TEvents[Key]>): void;
    on(type: '*', handler: WildcardHandler<TEvents>): void;
    on(type: any, handler: any): void {
      this.#emitter.on(type, handler);
    }
  
  }