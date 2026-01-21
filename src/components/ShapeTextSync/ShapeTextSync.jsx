import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "./ShapeTextSync.css";

const CONTENT = [
  {
    title: "Strategy",
    text: "We define a clear digital strategy aligned with your brand goals.",
  },
  {
    title: "Design",
    text: "We craft clean, functional, and visually striking experiences.",
  },
  {
    title: "Development",
    text: "We build scalable, high-performance digital products.",
  },
  {
    title: "Growth",
    text: "We help brands grow through optimization and iteration.",
  },
];

export default function ShapeTextSync() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  // Map scroll progress to step index (0 → 3)
  const step = useTransform(scrollYProgress, [0, 1], [0, 3]);

  return (
    <section className="shape-sync" ref={ref}>
      {/* LEFT: SHAPES */}
      <div className="shape-column">
        {CONTENT.map((_, index) => (
          <motion.div
            key={index}
            className="shape-box"
            animate={{
              opacity: step >= index ? 1 : 0.3,
              scale: step >= index ? 1 : 0.9,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* RIGHT: TEXT */}
      <div className="text-column">
        {CONTENT.map((item, index) => (
          <motion.div
            key={index}
            className="text-block"
            animate={{
              opacity: step === index ? 1 : 0,
              y: step === index ? 0 : 20,
            }}
            transition={{ duration: 0.4 }}
          >
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
