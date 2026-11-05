import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Showreel } from "@/components/Showreel";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Spotlight } from "@/components/Spotlight";
import { Table } from "@/components/Table";
import { Viewfinder } from "@/components/Viewfinder";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Showreel />
        <Manifesto />
        <Marquee />
        <Services />
        <Process />
        <Spotlight />
        <Table />
        <Contact />
      </main>
      <Viewfinder />
      <Cursor />
    </>
  );
}
