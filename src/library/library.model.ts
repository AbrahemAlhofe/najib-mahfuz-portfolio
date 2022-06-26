import { LibraryModes, TBook } from "./types";

export default class LibraryModel {

    head: number = 0;

    mode: LibraryModes = LibraryModes.Browsing

    get length () { return Math.ceil( this.books.length / 6 ) - 1 }

    // TODO: Set length to return type
    get currentBuffer (): Array<TBook> {

        const currentBuffer = this.books.slice(this.head * 6, ( this.head * 6 ) + 6);
    
        return currentBuffer
    
    }

    constructor (public books: Array<TBook>) {



    }

}