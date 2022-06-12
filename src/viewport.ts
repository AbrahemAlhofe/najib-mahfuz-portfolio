import mitt, { Emitter, Handler, WildcardHandler } from "mitt";

type TEvents = {
    ['swipe:up'] : any
    ['swipe:down'] : any
    ['swipe:right'] : any
    ['swipe:left'] : any
    ['swipe:vertical'] : any
    ['swipe:horizontal'] : any
};

enum Directions { Up, Down, Left, Right }

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

        (() => {

          let y: number = 0;
          let x: number = 0;
          let deltaY: number = 0;
          let deltaX: number = 0;
          let direction: Directions | null = null;
  
          document.addEventListener("touchstart", (event) => {
  
            for ( let touch of event.changedTouches ) {
              
              y = touch.screenY;
              x = touch.screenX;
  
            }
  
          })
  
          document.addEventListener("touchend", (event) => {
  
            for ( let touch of event.changedTouches ) {
              

              deltaY = touch.screenY - y;
              deltaX = touch.screenX - x;

              if ( Math.abs( deltaY ) > Math.abs( deltaX ) ) {

                direction = deltaY > 0 ? Directions.Up : Directions.Down;
  
              } 

              if ( Math.abs( deltaY ) < Math.abs( deltaX ) ) {

                direction = deltaX > 0 ? Directions.Left : Directions.Right;
  
              } 
              
              console.table({ deltaX, deltaY, direction })
              
              if ( deltaX === 0 || deltaY === 0 ) direction = null;
  
            }
  
          })
  
          document.addEventListener("touchend", () => {
  
            if ( direction !== null ) {
  
              if ( direction === Directions.Up ) this.#emitter.emit("swipe:down");
              if ( direction === Directions.Down ) this.#emitter.emit("swipe:up");
              if ( direction === Directions.Up || direction === Directions.Down ) this.#emitter.emit("swipe:vertical");
  
              if ( direction === Directions.Left ) this.#emitter.emit("swipe:right");
              if ( direction === Directions.Right ) this.#emitter.emit("swipe:left");
              if ( direction === Directions.Left || direction === Directions.Right ) this.#emitter.emit("swipe:horizontal");
  
            }
  
          })

        })()

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