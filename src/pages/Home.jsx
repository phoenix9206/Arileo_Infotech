import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import ScrollSection from "../components/ScrollSection/ScrollSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <ScrollSection />
      <ScrollSection reverse />
    </>
  );
}
