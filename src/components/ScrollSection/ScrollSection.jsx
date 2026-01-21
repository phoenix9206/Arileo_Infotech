import { motion } from "framer-motion";
import "./ScrollSection.css";

export default function ScrollSection({ reverse = false }) {
  return (
    <motion.section
      className={`scroll-section ${reverse ? "reverse" : ""}`}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="scroll-left">
        <h2>We design meaningful digital experiences</h2>
        <p>
          Our approach blends strategy, design, and technology to help brands
          stand out in a digital-first world.
        </p>
      </div>

      <div className="scroll-right">
        <div className="visual-box"></div>
      </div>
    </motion.section>
  );
}
