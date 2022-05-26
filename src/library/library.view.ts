import mitt, { Emitter, Handler, WildcardHandler } from "mitt";
import { TEvents, TBook } from "./types";
import { gsap } from 'gsap';

// @ts-ignore
export class LibraryView implements Emitter<TEvents> {

    $root: HTMLDivElement = document.querySelector(".library") as HTMLDivElement;
  
    #emitter: Emitter<TEvents> = mitt<TEvents>();
  
    constructor () {
  
      const observer = new IntersectionObserver((entries) => {
  
        entries.forEach(entry => {
  
          if ( entry.intersectionRatio < 1 ) return 
            
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
  
      const $inspector = document.querySelector(".library .inspector") as HTMLElement;
      const $inspector__title = $inspector.querySelector(".inspector__title span") as HTMLElement;
      const $inspector__paragraph = $inspector.querySelector(".inspector__paragraph span") as HTMLElement;
      const $inspector__thumbnail = $inspector.querySelector(".inspector__thumbnail img") as HTMLImageElement;
      
      gsap.set($inspector__title, { yPercent: 110 });
      gsap.set($inspector__paragraph, { yPercent: 110 });
      gsap.set($inspector__thumbnail, { yPercent: 110 });
  
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
  
      const $inspector = document.querySelector(".library .inspector") as HTMLElement;
      const $inspector__title = $inspector.querySelector(".inspector__title") as HTMLElement;
      const $inspector__paragraph = $inspector.querySelector(".inspector__paragraph") as HTMLElement;
      const $inspector__thumbnail = $inspector.querySelector(".inspector__thumbnail img") as HTMLImageElement;
  
      $inspector.classList.add("inspector--open");
  
      $inspector__title.innerText = selectedBook.title;
  
      $inspector__paragraph.innerText = "لكن لا بد أن أوضح لك أن كل هذه الأفكار المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤلاء الأشخاص الذين لا يدركون بأن السعادة لا بد أن نستشعرها بصورة أكثر عقلانية ومنطقية فيعرضهم هذا لمواجهة الظروف الأليمة، وأكرر بأنه لا يوجد من يرغب في الحب ونيل المنال ويتلذذ بالآلام، الألم هو الألم ولكن نتيجة لظروف ما قد تكمن السعاده فيما نتحمله من كد وأسي.      ";
  
      $inspector__thumbnail.src = selectedBook.thumbnail;

      gsap.timeline()
        .to($inspector__thumbnail, { yPercent: 0 })
        .to($inspector, { rotateY: 180 })
  
    }
  
    async hideInspector () {
  
      const $inspector = document.querySelector(".library .inspector") as HTMLElement;
      const $inspector__thumbnail = $inspector.querySelector(".inspector__thumbnail img") as HTMLImageElement;
      
      return new Promise((resolve, reject) => {
  
        try {
          
          gsap.timeline()
            .to($inspector__thumbnail, { yPercent: 110, onComplete: resolve })
            .to($inspector, { rotateY: 0 })

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

    on<Key extends keyof TEvents>(type: Key, handler: Handler<TEvents[Key]>): void;
    on(type: '*', handler: WildcardHandler<TEvents>): void;
    on(type: any, handler: any): void {
      this.#emitter.on(type, handler);
    }
  
  }