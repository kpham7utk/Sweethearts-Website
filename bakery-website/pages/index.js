import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/images/logo.png';

export default function Home({ featuredProducts }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
            <Image src={logo} alt="Sweethearts Bakery Logo" width={200} height={200} />
            <h1>Sweethearts Bakery</h1>
            <p>Artisan pastries, handmade with love every day.</p>
            <Link href="/products"><button className="primary-btn">Shop Our Menu</button></Link>
        </div>
       </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Treats</h2>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <Image src={product.image} alt={product.name} width={300} height={300} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <Link href={`/products/${product.id}`}><button>View Details</button></Link>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Our Story</h2>
        <p>At Sweethearts Bakery, we use only the finest local ingredients...</p>
        <p>Visit us at [Address, City, State] or order online for pickup or delivery.</p>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <blockquote>“The best croissants I’ve ever tasted!” — Sarah L.</blockquote>
        <blockquote>“A must-try bakery for anyone who loves sweets.” — Alex M.</blockquote>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Stay Updated</h2>
        <form action="/api/subscribe" method="post">
          <input type="email" name="email" placeholder="Your email" required />
          <button type="submit">Sign Up</button>
        </form>
      </section>

      {/* Social & Footer */}
      <footer>
        <p>Follow us on Instagram @SweetheartsBakery</p>
        <p>© 2024 Sweethearts Bakery</p>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  // Fetch featured products from data or API
  const featuredProducts = [
    {id: 'chocolate-cake', name: 'Chocolate Cake', price: 20, image: '/images/chocolate-cake.jpg'},
    {id: 'croissant', name: 'Croissant', price: 3, image: '/images/croissant.jpg'}
    // ... more products
  ];
  
  return {
    props: {
      featuredProducts
    }
  };
}