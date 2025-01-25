import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Visit Us</h3>
          <p>123 Bakery Street</p>
          <p>Sweetville, CA 90210</p>
          <p>Mon-Sat: 7am - 7pm</p>
          <p>Sunday: 8am - 5pm</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link href="/about">About Us</Link>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: ahelpfullheart@itssweetrighthere.com</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe for updates and special offers!</p>
          <form className="mt-4">
            <input 
              type="email" 
              placeholder="Your email"
              className="w-full p-2 border rounded mb-2"
            />
            <button 
              type="submit"
              className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Sweethearts Bakery. All rights reserved.</p>
      </div>
    </footer>
  );
}