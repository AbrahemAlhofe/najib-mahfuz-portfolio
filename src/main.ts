import 'reset-css'
import './style.css'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LibraryAggregator from './library';

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
      
    document.documentElement.style.overflow = 'hidden'

    let previousValue = 0;

    const onWheelEventHandler = (e: WheelEvent) => {

      let changeRate = previousValue - e.deltaY;

      previousValue = e.deltaY;
      
      if ( e.deltaY !== -0 ) return 

      const isMoveUp = changeRate > 0;
      const isMoveDown = changeRate < 0;
      
      if ( isMoveUp ) Library.next();
      
      if ( isMoveDown ) Library.previous();

      if ( Library.isExceededLimit() ) {

        document.documentElement.style.overflow = 'visible';

        document.removeEventListener("wheel", onWheelEventHandler);

      }

    }

    document.addEventListener("wheel", onWheelEventHandler);

  })

});

// Register Plugins
gsap.registerPlugin(ScrollTrigger);