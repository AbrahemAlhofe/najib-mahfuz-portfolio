import 'reset-css'
import './style.css'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LibraryAggregator from './library';
import ViewportAggregator from './viewport';

const Viewport = new ViewportAggregator();
const Library = new LibraryAggregator([
  
  // Group 1
  {
    title: "بين القصرين",
    thumbnail: "assets/images/books/dummy-1.jpg"
  },
  {
    title: "خان الخليلي",
    thumbnail: "assets/images/books/dummy-2.jpg"
  },
  {
    title: "أولاد حارتنا",
    thumbnail: "assets/images/books/dummy-3.jpg"
  },
  {
    title: "دنيا الله",
    thumbnail: "assets/images/books/dummy-1.jpg"
  },
  {
    title: "اللص و الكلاب",
    thumbnail: "assets/images/books/dummy-2.jpg"
  },
  {
    title: "الحب تحت المطر",
    thumbnail: "assets/images/books/dummy-3.jpg"
  },

  // Group 2
  {
    title: "ثرثرة فوق النيل",
    thumbnail: "assets/images/books/dummy-4.jpg"
  },
  {
    title: "اللص و الكلاب",
    thumbnail: "assets/images/books/dummy-2.jpg"
  },
  {
    title: "الحب تحت المطر",
    thumbnail: "assets/images/books/dummy-3.jpg"
  },
  {
    title: "السكرية",
    thumbnail: "assets/images/books/dummy-4.jpg"
  },
  {
    title: "اللص و الكلاب",
    thumbnail: "assets/images/books/dummy-2.jpg"
  },
  {
    title: "الحب تحت المطر",
    thumbnail: "assets/images/books/dummy-3.jpg"
  },
  
  // Group 3
  {
    title: "كفاح طيبة",
    thumbnail: "assets/images/books/dummy-4.jpg"
  }

]);

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

    Viewport.on("swipe", () => {
      
      if ( exceededCounts >= 2 ) {

        Viewport.unlock();
        
        Viewport.off("swipe:up");
        
        Viewport.off("swipe:down");

        Viewport.off("swipe");
        
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