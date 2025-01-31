import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image'

export default function Carousel({ images = [] }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true
  };

  return (
    <div className="carousel-wrapper">
      <Slider {...settings}>
        {images.map((src, i) => (
          <div key={i}>
          <Image
            src={src}
            alt={`Slide ${i}`}
            width={500} // Add appropriate width
            height={300} // Add appropriate height
            className="carousel-image"
          />
          </div>
        ))}
      </Slider>
    </div>
  );
}