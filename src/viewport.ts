import mitt, { Emitter, Handler, WildcardHandler } from "mitt";

type TEvents = {
    swipe: any
    ['swipe:up'] : any
    ['swipe:down'] : any
};

// @ts-ignore
export default class ViewportAggregator implements Emitter<TEvents> {

    $root: HTMLElement = document.documentElement

    #emitter: Emitter<TEvents> = mitt<TEvents>();

    constructor () {

        let previousValue = 0;

        const onWheelEventHandler = (e: WheelEvent) => {
    
          let changeRate = previousValue - e.deltaY;
    
          previousValue = e.deltaY;
          
          if ( e.deltaY === -0 && e.deltaX === -0 ) {

            const isMoveUp = changeRate > 0;
            const isMoveDown = changeRate < 0;
  
            this.#emitter.emit("swipe");
            
            if ( isMoveUp ) this.#emitter.emit("swipe:up");
            
            if ( isMoveDown ) this.#emitter.emit("swipe:down")

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