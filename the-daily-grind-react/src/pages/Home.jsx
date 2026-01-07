import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            if (entry.target.classList.contains("reveal-image")) {
              entry.target.classList.add("reveal-active");
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-scroll], .reveal-image");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-container">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1961&auto=format&fit=crop"
            alt="Burlap sack filled with fresh roasted coffee beans"
            className="parallax-img"
          />
        </div>

        <div className="hero-content fade-up">
          <h1 data-scroll>A Symphony in Every Sip</h1>
          <p data-scroll className="delay-1">
            Experience the art of coffee, from bean to brew.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <div className="grid-split">

            <div className="text-block" data-scroll>
              <span className="eyebrow">Our Philosophy</span>
              <h2>More Than Coffee, It's a Ritual</h2>

              <p>
                At The Daily Grind, we believe that a perfect cup of coffee is a moment of pause,
                a small luxury that shapes the day. We are dedicated to the craft, sourcing only the most
                exceptional single-origin beans and roasting them with meticulous care to unlock their unique character.
              </p>

              <a href="about.html" className="text-link">
                Discover Our Story
              </a>
            </div>

            <div className="image-block reveal-image" data-scroll>
              <div className="mask">
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop"
                  alt="A beautifully prepared latte in a ceramic cup"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Parallax Quote Section */}
      <section className="quote-break">
        <div
          className="parallax-bg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1495474472287-4d713b20e473?q=80&w=1770&auto=format&fit=crop')"
          }}
        />

        <div className="quote-content container" data-scroll>
          <h3>
            "The journey of the bean is a story of soil, sun, and soul. We are simply its humble narrators."
          </h3>
          <p>- The Roasters at The Daily Grind</p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">

          <div className="section-header center" data-scroll>
            <span className="eyebrow">Our Collections</span>
            <h2>Curated for the Connoisseur</h2>
            <p>
              Explore our signature blends, each crafted to deliver a distinct and memorable tasting experience.
            </p>
          </div>

          <div className="product-grid">

            {/* Product 1 */}
            <a href="products.html" className="product-card" data-scroll>
              <div className="card-image">
                <img src="h1.jpg" alt="Morning Solstice Blend coffee bag" />
                <div className="hover-overlay"><span>View Blend</span></div>
              </div>
              <div className="card-info">
                <h3>Morning Solstice Blend</h3>
                <p className="notes">Notes of cocoa, toasted almond, and citrus</p>
                <p className="price">$22.00</p>
              </div>
            </a>

            {/* Product 2 */}
            <a href="products.html" className="product-card" data-scroll data-delay="0.1">
              <div className="card-image">
                <img src="h2.jpg" alt="Midnight Velvet Roast coffee bag" />
                <div className="hover-overlay"><span>View Blend</span></div>
              </div>
              <div className="card-info">
                <h3>Midnight Velvet Roast</h3>
                <p className="notes">Notes of dark chocolate, cherry, and spice</p>
                <p className="price">$24.00</p>
              </div>
            </a>

            {/* Product 3 */}
            <a href="products.html" className="product-card" data-scroll data-delay="0.2">
              <div className="card-image">
                <img src="h3.jpg" alt="Golden Hour Espresso coffee bag" />
                <div className="hover-overlay"><span>View Blend</span></div>
              </div>
              <div className="card-info">
                <h3>Golden Hour Espresso</h3>
                <p className="notes">Notes of caramel, hazelnut, and brown sugar</p>
                <p className="price">$23.00</p>
              </div>
            </a>

          </div>
        </div>
      </section>

    </main>
  );
}
