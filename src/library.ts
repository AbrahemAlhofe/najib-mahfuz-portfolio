import { gsap } from 'gsap';
import mitt, { Emitter, Handler, WildcardHandler } from 'mitt';

type TEvents = {
  intersection: IntersectionObserverEntry;
  next: number;
  move: any;
};

type TBook = {
  title: string;
  thumbnail: string;
}

enum LibraryModes { Reading, Browsing }

// @ts-ignore
export default class LibraryAggregator implements Emitter<TEvents> {

    $root: HTMLDivElement = document.querySelector(".library") as HTMLDivElement;

    #emitter: Emitter<TEvents> = mitt<TEvents>();

    head: number = 0;

    mode: LibraryModes = LibraryModes.Reading

    get length () { return Math.ceil( this.books.length / 6 ) - 1 }

    // TODO: Set length to return type
    get currentBuffer (): Array<TBook> {

      const currentBuffer = this.books.slice(this.head * 6, ( this.head * 6 ) + 6);

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

      const $books: NodeListOf<HTMLElement> = this.$root.querySelectorAll(".book");

      $books.forEach( (book: HTMLElement) => {

        book.addEventListener("click", () => {

          this.open(Number(book.dataset["index"] as string));

        })

      })

    }

    async open (bookIndex: number) {

      this.mode = LibraryModes.Browsing;

      const selectedBook = this.books[bookIndex];
      const $browser = document.querySelector(".library .browser") as HTMLElement;
      const $browser__title = $browser.querySelector(".browser__title span") as HTMLElement;
      const $browser__paragraph = $browser.querySelector(".browser__paragraph span") as HTMLElement;
      const $browser__thumbnail = $browser.querySelector(".browser__thumbnail img") as HTMLImageElement;
      
      gsap.set($browser__title, { yPercent: 110 });
      gsap.set($browser__paragraph, { yPercent: 110 });
      gsap.set($browser__thumbnail, { yPercent: 110 });
      `1`
      await this.hide();
      
      $browser.classList.add("browser--open");

      $browser__title.innerText = selectedBook.title;

      $browser__paragraph.innerText = "لكن لا بد أن أوضح لك أن كل هذه الأفكار المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤلاء الأشخاص الذين لا يدركون بأن السعادة لا بد أن نستشعرها بصورة أكثر عقلانية ومنطقية فيعرضهم هذا لمواجهة الظروف الأليمة، وأكرر بأنه لا يوجد من يرغب في الحب ونيل المنال ويتلذذ بالآلام، الألم هو الألم ولكن نتيجة لظروف ما قد تكمن السعاده فيما نتحمله من كد وأسي.      ";

      $browser__thumbnail.src = selectedBook.thumbnail;
      
      gsap.to($browser__title, { yPercent: 0 });
      gsap.to($browser__thumbnail, { yPercent: 0 });
      gsap.to($browser__paragraph, { yPercent: 0 });

      this.#emitter.on("move", () => {

        gsap.to($browser__title, { yPercent: 110 });
        gsap.to($browser__paragraph, { yPercent: 110 });
        gsap.to($browser__thumbnail, {
          
          yPercent: 110,

           onComplete: async () => {
            
            $browser.classList.remove("browser--open");

            await this.unhide();

            this.mode = LibraryModes.Reading;

            this.#emitter.off("move");

          }
        
        });


      })

    }

    hide () {

      return new Promise((resolve) => {

        const booksTimeline = gsap.timeline();
    
        booksTimeline
          .to(".book__thumbnail", {
            yPercent: -150,
            duration: 1,
            ease: "power2.out",
            onComplete: () => this.renderBooks()
          })
  
        const textsTimeline = gsap.timeline();
    
        textsTimeline
          .to(".library__title > span", {
            yPercent: -150,
            duration: 1,
            ease: "power2.out",
            onComplete: () => this.renderTitles()
          })
    
        const shadesTimeline = gsap.timeline();
    
          shadesTimeline
            .to(".library__shade span", {
              yPercent: 1000,
              duration: 1.5,
              ease: "power2.out",
              onComplete: resolve
            })

      })

    }

    unhide () {

      return new Promise((resolve) => {

        const booksTimeline = gsap.timeline();
    
        booksTimeline
          .to(".book__thumbnail", {
            yPercent: 0,
            duration: 1,
            ease: "power2.out",
          })
  
        const textsTimeline = gsap.timeline();
    
        textsTimeline
          .to(".library__title > span", {
            yPercent: 0,
            duration: 1,
            ease: "power2.out",
          })
    
        const shadesTimeline = gsap.timeline();
    
          shadesTimeline
            .to(".library__shade span", {
              yPercent: 0,
              duration: 1.5,
              ease: "power2.out",
              onComplete: resolve
            })

      })

    }

    // TODO: make it private method
    renderTitles () {

      const titles = document.querySelectorAll(".library__title > span");
  
      titles.forEach(($title, index) => {
        
        $title.innerHTML = this.currentBuffer[index].title;
      
      })

    }

    // TODO: make it private method
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
          $book.parentElement?.setAttribute("data-index", bookIndex.toString());
  
          bookIndex += 1

        }

      }

    }
  
    next (): void {

      this.#emitter.emit("move");
  
      if ( this.mode !== LibraryModes.Reading ) return;

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

      this.#emitter.emit("move");

      if ( this.mode !== LibraryModes.Reading ) return;

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