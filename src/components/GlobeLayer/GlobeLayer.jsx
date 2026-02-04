import { useEffect, useRef, useState } from "react";
import "./GlobeLayer.css";

export default function GlobeLayer() {
  const globeRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const lastOffset = useRef(0);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.style.setProperty("--bg-offset", `${offset}%`);
  }, [offset]);

  const onMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const delta = e.clientX - startX.current;
    setOffset(lastOffset.current + delta * 0.15);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    lastOffset.current = offset;
  };

  return (
    <div
      className="globe-layer"
      ref={globeRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
  );
}
