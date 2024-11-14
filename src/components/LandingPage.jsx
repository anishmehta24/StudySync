// src/components/LandingPage.jsx
import React, { useEffect, useState } from 'react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to add background to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen">
       <nav
    className={`fixed top-0 left-0 w-full z-10 transition-all duration-300 ${
      scrolled ? 'bg-gradient-to-r from-primary-light to-primary shadow-md' : 'bg-gradient-to-r from-background to-secondary-light shadow-md'
    }`}
  >
    <div className="container mx-auto flex items-center justify-between py-4 px-6">
      <a href="/" className={`text-3xl font-extrabold ${scrolled ? 'text-background' : 'text-primary'}`}>
        StudySync
      </a>
      <div>
        <a
          href="/login"
          className={`px-4 py-2 border rounded-md font-semibold transition duration-200 mr-4 ${
            scrolled
              ? 'text-background bg-primary hover:bg-secondary-dark border-background'
              : 'text-primary hover:bg-primary-light border-primary'
          }`}
        >
          Login
        </a>
        <a
          href="/signup"
          className={`px-4 py-2 border rounded-md font-semibold transition duration-200 ${
            scrolled
              ? 'text-background bg-primary hover:bg-secondary-dark border-background'
              : 'text-primary hover:bg-primary-light border-primary'
          }`}
        >
          Sign Up
        </a>
      </div>
    </div>
  </nav>

      {/* Hero Section with larger video */}
      <header className="container mx-auto mt-16 px-6 py-20 text-center md:text-left pt-28">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2 ml-10">
            <h1 className="text-4xl font-bold text-black md:text-6xl">
              Unlock the Power of Knowledge
            </h1>
            <p className="text-gray-700 mt-4 text-lg md:text-xl">
              Join our community of learners, share notes, get AI-powered summaries, and collaborate with others in real-time.
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <a
                href="/signup"
                className="bg-black text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition duration-200"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="ml-4 bg-white text-black px-6 py-3 rounded-md text-lg font-semibold border border-gray-300 hover:bg-gray-200 transition duration-200"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Video with increased width */}
          <div className="mt-10 md:mt-10 md:w-2/3 lg:w-3/4 flex justify-center">
            <video
              src="../public/hero-video.mp4"
              autoPlay
              muted
              loop
              className="w-full max-w-2xl rounded-lg shadow-lg"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-black mb-12">
          Why Choose StudySync?
        </h2>
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Feature 1 */}
          <div className="flex-1 text-center bg-white p-6 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-black">AI Note Generation</h3>
            <p className="text-gray-600 mt-2">
              Get AI-powered notes and summaries to boost your productivity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex-1 text-center bg-white p-6 rounded-md shadow-lg mt-8 md:mt-0 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-black">Community Support</h3>
            <p className="text-gray-600 mt-2">
              Connect with other learners in our Q&A and discussion forums.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex-1 text-center bg-white p-6 rounded-md shadow-lg mt-8 md:mt-0 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-black">Real-Time Collaboration</h3>
            <p className="text-gray-600 mt-2">
              Chat and collaborate in real-time with private and group chats.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6">
        <div className="container mx-auto text-center text-white">
          © 2024 StudySync. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
