import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import CakeClassCalendar from '../components/CakeClassCalendar';

export default function Home({ featuredProducts = [] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  
  const carouselImages = featuredProducts?.map((product) => product.image) || [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative">
      <nav className={`transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
        <div className="nav-container">
          <Link href="/about" prefetch={false}>
            About
          </Link>
          <div className="logo-container">
            <Link href="/" prefetch={false}>
              <Image
                src="/images/logo.png"
                alt="Sweethearts Bakery Logo"
                width={330}
                height={110}
                priority
                className="nav-logo"
              />
            </Link>
          </div>
          <Link href="/find-us" prefetch={false}>
            Find Us
          </Link>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Sweethearts Bakery</h1>
            <p>Delighting customers and creating moments of joy</p>
            {carouselImages.length > 0 && (
              <div className="carousel-container">
                <Carousel images={carouselImages} />
              </div>
            )}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="content-container">
            <h2 className="section-title">About Our Bakery</h2>
            <div className="about-content">
              <p className="about-text">
                Welcome to Sweethearts Bakery, where every creation is made with love and artisanal care. 
                Our story began with a simple passion for bringing joy through freshly baked goods. 
                Today, we continue this tradition by crafting small-batch pastries, artisan breads, 
                and custom cakes using only the finest ingredients.
              </p>
              <p className="about-text">
                From morning croissants to celebration cakes, each item is handcrafted with attention 
                to detail and a commitment to quality. We believe in creating not just delicious treats, 
                but moments of happiness to be shared with loved ones.
              </p>
            </div>
          </div>
        </section>

        <section className="classes-section">
          <CakeClassCalendar />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const featuredProducts = [
    {
      id: 'img8180',
      name: 'Bagel 8180',
      price: 5, 
      image: '/images/IMG_8180.JPG'
    },
    {
      id: 'img8409',
      name: 'Bagel 8409',
      price: 5, 
      image: '/images/IMG_8409.JPG'
    },
    {
      id: 'img8456',
      name: 'Bagel 8456',
      price: 5, 
      image: '/images/IMG_8456.JPG'
    }
  ];
  
  return {
    props: {
      featuredProducts
    },
    revalidate: 10
  };
}