// import { motion } from "framer-motion";
// import "./SplitScroll.css";

// export default function SplitScroll({ reverse = false }) {
//   return (
//     <section className={`split-scroll ${reverse ? "reverse" : ""}`}>
//       {/* LEFT CONTENT */}
//       <motion.div
//         className="split-left"
//         initial={{ opacity: 0, x: reverse ? 60 : -60 }}
//         whileInView={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: true }}
//       >
//         <h2>We design meaningful digital experiences</h2>
//         <p>
//           Our approach blends strategy, design, and technology to help brands
//           stand out in a digital-first world.
//         </p>
//       </motion.div>

//       {/* RIGHT CONTENT */}
//       <motion.div
//         className="split-right"
//         initial={{ opacity: 0, x: reverse ? -60 : 60 }}
//         whileInView={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: true }}
//       >
//         <div className="visual-box"></div>
//       </motion.div>
//     </section>
//   );
// }


import { motion } from "framer-motion";
import "./SplitScroll.css";

/**
 * SplitScroll
 *
 * Props:
 * - id       → REQUIRED for GSAP ScrollTrigger ("services", "solution")
 * - reverse  → boolean (false = 40–60, true = 60–40)
 * - title    → heading text
 * - text     → paragraph text
 */
export default function SplitScroll({
  id,
  reverse = false,
  title,
  text,
}) {
  return (
    <motion.section
      id={id}
      className={`split-scroll ${reverse ? "reverse" : ""}`}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* TEXT SIDE */}
      <div className="split-left">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>

      {/* VISUAL SIDE */}
      <div className="split-right">
        <div className="visual-box" />
      </div>
    </motion.section>
  );
}
