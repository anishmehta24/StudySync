import React from 'react';

const Footer = () => {
  return (
    <div className='bg-gradient-to-r from-background to-secondary-dark '>
        <hr className="border-gray-500  mb-2" />
    <footer className="py-8">
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <p className="text-text text-base md:text-lg lg:text-xl">
          &copy;2025 Anish Mehta. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm md:text-base mt-4">
          Designed and developed with ❤️ by Anish Mehta.
        </p>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
