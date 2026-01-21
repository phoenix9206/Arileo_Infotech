import { useEffect, useState } from "react";
import "./Cursor.css";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      className="cursor-dot"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    />
  );
}
