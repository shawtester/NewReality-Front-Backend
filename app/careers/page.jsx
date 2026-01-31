import Navbar from "../components/Header";
import Career from "./components/section1";
import LifeAtNeev from "./components/section2";
import WhatWeOffer from "./components/section3";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <div>
<Navbar/>
     <Career/> 
     <LifeAtNeev/>
     <WhatWeOffer/>
      <Footer/>
    </div>
  );
}