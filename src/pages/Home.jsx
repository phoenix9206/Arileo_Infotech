import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import SplitScroll from "../components/SplitScroll/SplitScroll";
import TextHighlight from "../components/TextHighlight/TextHighlight";
import ShapeTextSync from "../components/ShapeTextSync/ShapeTextSync";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <SplitScroll />
      <SplitScroll reverse />

      <TextHighlight />

      <ShapeTextSync />
    </>
  );
}
