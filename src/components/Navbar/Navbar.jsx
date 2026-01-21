import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 80) {
        setVisible(false); // scroll down → hide
      } else {
        setVisible(true); // scroll up → show
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav className={`navbar ${visible ? "show" : "hide"}`}>
      <div className="nav-left">Arileo Infotech</div>

      <ul className="nav-center">
        <li>Home</li>
        <li>About</li>
        <li>Portfolio</li>
        <li>Contact</li>
        <li>FAQ</li>
      </ul>

      <div className="nav-right">
        <button>Get in Touch</button>
      </div>
    </nav>
  );
}
