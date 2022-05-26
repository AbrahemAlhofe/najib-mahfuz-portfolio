import 'reset-css'
import './style.css'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LibraryAggregator from './library/library';
import ViewportAggregator from './viewport';
import books from '../static/books.json';

const Viewport = new ViewportAggregator();
const Library = new LibraryAggregator(books);

document.addEventListener("readystatechange", () => {

  gsap.from([".figure#main #Frame", ".figure#main #FirstName", ".figure#main #SecondName", ".figure#main #Pronoun"], {
    yPercent: 50,
    opacity: 0.2,
    duration: 1.5
  });

  gsap.to(".figure#main #Pronoun", {
    scrollTrigger: {
      scrub: 0.5,
      end: "+=1600"
    },
    y: 1500,
  });

  Library.on("intersection", () => {

    let exceededCounts = 0;
      
    Viewport.lock();

    Viewport.on("swipe:up", () => Library.next())

    Viewport.on("swipe:down", () => Library.previous())

    Viewport.on("swipe:vertical", () => {
      
      if ( exceededCounts >= 2 ) {

        Viewport.unlock();
        
        Viewport.off("swipe:up");
        
        Viewport.off("swipe:down");

        Viewport.off("swipe:vertical");
        
        exceededCounts = 0;
        
      } else {

        if ( Library.isExceededLimit() ) exceededCounts += 1;
        else exceededCounts = 0;

      }

    })

  })

});

// Register Plugins
gsap.registerPlugin(ScrollTrigger);