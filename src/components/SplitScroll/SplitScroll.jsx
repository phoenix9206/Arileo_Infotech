import { motion } from "framer-motion";
import "./SplitScroll.css";

export default function SplitScroll({ reverse = false }) {
  return (
    <section className={`split-scroll ${reverse ? "reverse" : ""}`}>
      {/* LEFT CONTENT */}
      <motion.div
        className="split-left"
        initial={{ opacity: 0, x: reverse ? 60 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2>We design meaningful digital experiences</h2>
        <p>
          Our approach blends strategy, design, and technology to help brands
          stand out in a digital-first world.
        </p>
      </motion.div>

      {/* RIGHT CONTENT */}
      <motion.div
        className="split-right"
        initial={{ opacity: 0, x: reverse ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="visual-box"></div>
      </motion.div>
    </section>
  );
}
