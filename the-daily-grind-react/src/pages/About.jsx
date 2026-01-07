import { useEffect } from "react";

export default function About() {
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
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1771&auto=format&fit=crop"
            alt="Coffee brewing process"
            className="parallax-img"
          />
        </div>

        <div className="hero-content fade-up">
          <h1 data-scroll>Our Story</h1>
          <p data-scroll className="delay-1">
            Cultivating community, one cup at a time.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="intro-section">
        <div className="container">
          <div className="grid-split">
            
            <div className="image-block reveal-image" data-scroll>
              <div className="mask">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d713b20e473?q=80&w=1770&auto=format&fit=crop"
                  alt="Barista pouring coffee"
                />
              </div>
            </div>

            <div className="text-block" data-scroll>
              <span className="eyebrow">Est. 2015</span>
              <h2>From Humble Beginnings</h2>
              <p>
                The Daily Grind started in a small garage with a single roaster and a dream. 
                We wanted to bring the authentic taste of ethically sourced coffee to our neighborhood.
              </p>
              <p>
                Today, we continue that mission by partnering directly with farmers and 
                roasting in small batches to ensure quality in every bag.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}