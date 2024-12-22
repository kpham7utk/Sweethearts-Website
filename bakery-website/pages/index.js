import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/images/logo.png';

export default function Home() {
  return (
    <>
      <nav>
        <div className="nav-container">
          <div className="nav-left">
            <Link href="/about">About</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/order-now">Order Now</Link>
          </div>
          
          <div className="nav-center">
            <Link href="/">
              <Image src={logo} alt="Bakery Logo" width={60} height={60} style={{ width: 'auto', height: 'auto' }} />
            </Link>
          </div>
          
          <div className="nav-right">
            <Link href="/catering">Catering</Link>
            <Link href="/find-us">Find Us</Link>
            <Link href="/join-us">Join Us</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Artisan Pastries, Handcrafted Daily</h1>
          <p>Delighting customers and creating moments of joy</p>
          {/* Remove the preorder button */}
        </div>
      </section>

      {/* Other sections remain the same */}
      <section>
        <div className="content-container">
          <h2>About Our Bakery</h2>
          <p>We’re a small-batch, artisan bakery dedicated to ...</p>
        </div>
      </section>

      <section>
        <div className="content-container">
          <h2>Our Menu</h2>
          <p>Handcrafted pastries available fresh ...</p>
        </div>
      </section>

      <section>
        <div className="content-container">
          <h2>Join Our E-Mail List</h2>
          <form>
            <input type="email" placeholder="Your email" />
            <button>Join</button>
          </form>
        </div>
      </section>

      <footer>
        <p>SweetHearts Bakery</p>
        <p>Time - Time</p>
      </footer>
    </>
  );
}

export async function getStaticProps() {
  const featuredProducts = [
    {id: 'chocolate-cake', name: 'Chocolate Cake', price: 20, image: '/images/chocolate-cake.jpg'},
    {id: 'croissant', name: 'Croissant', price: 3, image: '/images/croissant.jpg'}
  ];
  
  return {
    props: {
      featuredProducts
    }
  };
}