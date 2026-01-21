import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "./TextHighlight.css";

const TEXT =
  "We create digital experiences that help brands stand out in a connected world.";

export default function TextHighlight() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const letters = TEXT.split("");

  return (
    <section className="text-highlight" ref={containerRef}>
      <p>
        {letters.map((char, index) => {
          const opacity = useTransform(
            scrollYProgress,
            [index / letters.length, (index + 1) / letters.length],
            [0.2, 1]
          );

          return (
            <motion.span key={index} style={{ opacity }}>
              {char}
            </motion.span>
          );
        })}
      </p>
    </section>
  );
}
