import mitt, { Emitter, Handler, WildcardHandler } from 'mitt';
import { LibraryView } from './library.view';
import { TEvents, LibraryModes, TBook } from './types';

// @ts-ignore
export default class LibraryAggregator implements Emitter<TEvents> {

    $root: HTMLDivElement = document.querySelector(".library") as HTMLDivElement;

    #emitter: Emitter<TEvents> = mitt<TEvents>();

    head: number = 0;

    mode: LibraryModes = LibraryModes.Browsing

    view = new LibraryView();

    get length () { return Math.ceil( this.books.length / 6 ) - 1 }

    // TODO: Set length to return type
    get currentBuffer (): Array<TBook> {

      const currentBuffer = this.books.slice(this.head * 6, ( this.head * 6 ) + 6);

      return currentBuffer

    }

    constructor (public books: Array<TBook>) {

      this.view.on("intersection", entry => this.#emitter.emit("intersection", entry))

      this.view.renderShelves( books );

      this.view.on("book:click", (book) => {

        this.inspect(Number(book.dataset["index"] as string));

      })

    }

    async inspect (bookIndex: number) {

      this.mode = LibraryModes.Inspecting;
      
      await this.view.fadeUp();

      this.view.renderInspector( this.books[bookIndex] );

      this.#emitter.on("move", async () => {

        await this.view.hideInspector();

        await this.view.appearUp();

        this.mode = LibraryModes.Browsing;

        this.#emitter.off("move");
  
      })

    }
  
    async next () {

      this.#emitter.emit("move");
  
      if ( this.mode !== LibraryModes.Browsing ) return;

      if ( this.head >= Math.ceil( this.books.length / 6 ) - 1 ) return;
      
      await this.view.fadeUp();
      
      this.head += 1;
      
      await this.view.renderShelves( this.currentBuffer );

      this.view.appearUp();

    }

    async previous () {

      this.#emitter.emit("move");

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