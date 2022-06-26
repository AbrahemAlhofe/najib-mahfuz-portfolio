import mitt, { Emitter, Handler, WildcardHandler } from 'mitt';
import { LibraryView } from './library.view';
import { TEvents, LibraryModes, TBook } from './types';
import { gsap } from 'gsap'; 
import LibraryModel from './library.model';
import ViewportAggregator from '../viewport';

// @ts-ignore
export default class LibraryController implements Emitter<TEvents> {

    $root: HTMLDivElement = document.querySelector(".library") as HTMLDivElement;

    #emitter: Emitter<TEvents> = mitt<TEvents>();

    view = new LibraryView();

    model: LibraryModel

    #viewport = new ViewportAggregator();

    constructor (books: Array<TBook>) {

      this.view.on("intersection", entry => this.#emitter.emit("intersection", entry))

      this.view.renderShelves( books );

      this.model = new LibraryModel(books);

    }

    async inspect (bookIndex: number) {

      this.model.mode = LibraryModes.Inspecting;
      
      await this.view.fadeUp();

      this.view.renderInspector( this.model.books[bookIndex] );

      const isSmallDevice = window.matchMedia("(max-width: 1024px)").matches;
      
      const $inspector = this.view.$root.querySelector(".inspector");

      let rotates = 1;

      const onSwipeLeft = () => rotates -= 1;
      
      const onSwipeRight = () => rotates += 1;

      const onSwipe = () => gsap.to($inspector, { rotateY : `${rotates * 180}deg` })

      if ( isSmallDevice ) {

        this.#viewport.on("swipe:horizontal", onSwipe);
  
        this.#viewport.on("swipe:left", onSwipeLeft);
  
        this.#viewport.on("swipe:right", onSwipeRight)

        $inspector!.addEventListener("click", () => { onSwipeLeft(); onSwipe() });

      }

      this.#viewport.on("swipe:vertical", async () => {

        await this.view.hideInspector();

        await this.view.appearUp();

        this.model.mode = LibraryModes.Browsing;
  
        this.#viewport.off("swipe:vertical");

        if ( isSmallDevice ) {
          
          this.#viewport.off("swipe:left", onSwipeLeft);
  
          this.#viewport.off("swipe:right", onSwipeRight);
  
          this.#viewport.off("swipe:horizontal");
    
        }

      })

    }
  
    async next () {

      if ( this.model.mode !== LibraryModes.Browsing ) return;

      if ( this.model.head >= Math.ceil( this.model.books.length / 6 ) - 1 ) return;
      
      await this.view.fadeUp();
      
      this.model.head += 1;
      
      await this.view.renderShelves( this.model.currentBuffer );

      this.view.appearUp();

    }

    async previous () {

      if ( this.model.mode !== LibraryModes.Browsing ) return;

      if ( this.model.head <= 0 ) return;

      await this.view.fadeDown();
      
      this.model.head -= 1;
      
      await this.view.renderShelves( this.model.currentBuffer );

      this.view.appearDown();

    }

    isExceededLimit(): boolean {

      return this.model.head >= this.model.length || this.model.head <= 0;
      
    }

    on<Key extends keyof TEvents>(type: Key, handler: Handler<TEvents[Key]>): void;
    on(type: '*', handler: WildcardHandler<TEvents>): void;
    on(type: any, handler: any): void {
      this.#emitter.on(type, handler);
    }
  
  }