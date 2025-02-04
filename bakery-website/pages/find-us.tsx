import React from 'react';
import Link from 'next/link';

const FindUs = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-pink-100 via-pink-50 to-white">
      <div className="text-center max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold font-playfair mb-4">Find Us</h1>
        <p className="text-lg text-gray-600 mb-6">
          We're working on something sweet! Check back soon for our location and contact details.
        </p>
        <Link 
          href="/"
          className="inline-block bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default FindUs;