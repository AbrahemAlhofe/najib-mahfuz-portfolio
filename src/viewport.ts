import mitt, { Emitter, Handler, WildcardHandler } from "mitt";

type TEvents = {
    ['swipe:up'] : any
    ['swipe:down'] : any
    ['swipe:right'] : any
    ['swipe:left'] : any
    ['swipe:vertical'] : any
    ['swipe:horizontal'] : any
};

// @ts-ignore
export default class ViewportAggregator implements Emitter<TEvents> {

    $root: HTMLElement = document.documentElement

    #emitter: Emitter<TEvents> = mitt<TEvents>();

    constructor () {

        let deltaY = 0;
        let deltaX = 0;

        const onWheelEventHandler = (e: WheelEvent) => {
          
          // -0 value appears once in delta variables' values
          if ( e.deltaY === -0 && e.deltaX === -0 ) {

            if ( Math.abs( deltaY ) > Math.abs( deltaX ) ) {

              const isMoveUp = deltaY > 0;
              const isMoveDown = deltaY < 0;

              if ( isMoveUp ) this.#emitter.emit("swipe:up");
              
              if ( isMoveDown ) this.#emitter.emit("swipe:down");
  
              this.#emitter.emit("swipe:vertical");

            } 

            if ( Math.abs( deltaY ) < Math.abs( deltaX ) ) {

              const isSwipeLeft = deltaX > 0;
              const isSwipeRight = deltaX < 0;

              if ( isSwipeLeft ) this.#emitter.emit("swipe:left");
  
              if ( isSwipeRight ) this.#emitter.emit("swipe:right");
  
              this.#emitter.emit("swipe:horizontal");
            
            } 

          } else {

            deltaY = e.deltaY;

            deltaX = e.deltaX;

          }
    
        }
    
        document.addEventListener("wheel", onWheelEventHandler);

    }

    lock () {
      document.documentElement.style.overflow = 'hidden'
    }

    unlock () {
      document.documentElement.style.overflow = 'visible'
    }

    on<Key extends keyof TEvents>(type: Key, handler: Handler<TEvents[Key]>): void;
    on(type: '*', handler: WildcardHandler<TEvents>): void;
    on(type: any, handler: any): void {
      this.#emitter.on(type, handler);
    }

    off<Key extends keyof TEvents>(type: Key, handler?: Handler<TEvents[Key]>): void;
    off(type: "*", handler: WildcardHandler<TEvents>): void;
    off(type: any, handler?: any): void {
        this.#emitter.off(type, handler);
    }

}