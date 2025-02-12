import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen hero"> {/* Using your existing hero class for the gradient background */}
      <div className="hero-content"> {/* Using your existing hero-content class */}
        <div className="mb-12">
          <Image
            src="/images/logotransparent.png"
            alt="Sweethearts Bakery Logo"
            width={330}
            height={110}
            priority
            className="mx-auto"
          />
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-6">
          Coming Soon
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto px-4">
          We're baking up something special! Our new website will be ready soon.
        </p>
      </div>
    </div>
  );
}