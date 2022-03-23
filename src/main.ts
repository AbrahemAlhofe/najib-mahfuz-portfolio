import 'reset-css'
import './style.css'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

});

// Register Plugins
gsap.registerPlugin(ScrollTrigger);