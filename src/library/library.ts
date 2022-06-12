import mitt, { Emitter, Handler, WildcardHandler } from 'mitt';
import { LibraryView } from './library.view';
import { TEvents, LibraryModes, TBook } from './types';
import { gsap } from 'gsap'; 
import ViewportAggregator from '../viewport';

// @ts-ignore
export default class LibraryAggregator implements Emitter<TEvents> {

    $root: HTMLDivElement = document.querySelector(".library") as HTMLDivElement;

    #emitter: Emitter<TEvents> = mitt<TEvents>();

    head: number = 0;

    mode: LibraryModes = LibraryModes.Browsing

    view = new LibraryView();

    #viewport = new ViewportAggregator();

    get length () { return Math.ceil( this.books.length / 6 ) - 1 }

    // TODO: Set length to return type
    get currentBuffer (): Array<TBook> {

      const currentBuffer = this.books.slice(this.head * 6, ( this.head * 6 ) + 6);

      return currentBuffer

    }

    constructor (public books: Array<TBook>) {

      this.view.on("intersection", entry => this.#emitter.emit("intersection", entry))

      this.view.renderShelves( books );

    }

    async inspect (bookIndex: number) {

      this.mode = LibraryModes.Inspecting;
      
      await this.view.fadeUp();

      this.view.renderInspector( this.books[bookIndex] );

      const isSmallDevice = window.matchMedia("(max-width: 1024px)").matches;
      
      const $inspector = this.view.$root.querySelector(".inspector");

      let rotates = 1;

      const onSwipeLeft = () => rotates -= 1;
      
      const onSwipeRight = () => rotates += 1;

      if ( isSmallDevice ) {

        this.#viewport.on("swipe:horizontal", () => gsap.to($inspector, { rotateY : `${rotates * 180}deg` }))
  
        this.#viewport.on("swipe:left", onSwipeLeft);
  
        this.#viewport.on("swipe:right", onSwipeRight)

      }

      this.#viewport.on("swipe:vertical", async () => {

        await this.view.hideInspector();

        await this.view.appearUp();

        this.mode = LibraryModes.Browsing;
  
        this.#viewport.off("swipe:vertical");

        if ( isSmallDevice ) {
          
          this.#viewport.off("swipe:left", onSwipeLeft);
  
          this.#viewport.off("swipe:right", onSwipeRight);
  
          this.#viewport.off("swipe:horizontal");
    
        }

      })

    }
  
    async next () {

      if ( this.mode !== LibraryModes.Browsing ) return;

      if ( this.head >= Math.ceil( this.books.length / 6 ) - 1 ) return;
      
      await this.view.fadeUp();
      
      this.head += 1;
      
      await this.view.renderShelves( this.currentBuffer );

      this.view.appearUp();

    }

    async previous () {

      if ( this.mode !== LibraryModes.Browsing ) return;

      if ( this.head <= 0 ) return;

      await this.view.fadeDown();
      
      this.head -= 1;
      
      await this.view.renderShelves( this.currentBuffer );

      this.view.appearDown();

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