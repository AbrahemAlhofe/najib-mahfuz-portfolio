import 'reset-css'
import './style.css'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LibraryAggregator from './library/library';
import ViewportAggregator from './viewport';
import books from '../data/books.json';
import certificates from '../data/certificates.json';
import prizes from '../data/prizes.json';

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

    Library.view.on("book:click", (book) => {

      Library.inspect(Number(book.dataset["index"] as string));

      Viewport.lock();

    })

  })

  const $certificates = document.querySelector("section#about-me ul");

  certificates.forEach(certificate => {

    const $certificate = document.createElement("li");
    const $figure = document.createElement("figure");
    const $image = document.createElement("img");
    const $caption = document.createElement("figcaption");
    const $title = document.createElement("span");
    const $date = document.createElement("date");

    $image.src = certificate.thumbnail;
    
    $figure.appendChild($image);
    $figure.appendChild($caption);

    $title.innerText = certificate.title;
    $date.innerText = certificate.date;

    $caption.appendChild($title);
    $caption.appendChild($date);

    $certificate.appendChild($figure);

    $certificates?.appendChild($certificate);

  })

  const $prizes = document.querySelector("section#about-me ul:nth-of-type(2)");

  prizes.forEach(prize => {

    const $prize = document.createElement("li");
    const $figure = document.createElement("figure");
    const $image = document.createElement("img");
    const $caption = document.createElement("figcaption");
    const $title = document.createElement("span");
    const $date = document.createElement("date");

    $image.src = prize.thumbnail;
    
    $figure.appendChild($image);
    $figure.appendChild($caption);

    $title.innerText = prize.title;
    $date.innerText = prize.date;

    $caption.appendChild($title);
    $caption.appendChild($date);

    $prize.appendChild($figure);

    $prizes?.appendChild($prize);

  })

});

// Register Plugins
gsap.registerPlugin(ScrollTrigger);