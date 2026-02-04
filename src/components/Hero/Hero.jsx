import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      {/* <div className="globe"></div> */}

      <div className="hero-content">
        <h1>Creating Brand & Digital Solutions</h1>
        <p>We help brands grow through design and technology.</p>

        <div className="hero-buttons">
          <button>Explore</button>
          <button className="secondary">Contact</button>
        </div>
      </div>
    </section>
  );
}
