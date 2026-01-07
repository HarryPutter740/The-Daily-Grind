import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">The Daily Grind</Link>

        <nav>
          <ul className="nav-links">
            <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>Our Story</NavLink></li>
            <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Collections</NavLink></li>
            <li><NavLink to="/subscription" className={({ isActive }) => isActive ? "active" : ""}>Subscription</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
