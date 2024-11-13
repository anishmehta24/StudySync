// src/components/LandingPage.jsx
import React from 'react';

const LandingPage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Navbar */}
      <nav className="bg-primary py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-background">
            StudySync
          </a>
          <div>
            <a
              href="/login"
              className="bg-background text-primary-dark px-4 py-2 border border-primary-light rounded-md hover:bg-primary transition duration-200 mr-4 hover:text-background "
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-background text-primary-dark px-4 py-2 rounded-md border border-primary-light hover:bg-primary transition duration-200 hover:text-background "
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-primary-dark md:text-6xl">
              Unlock the Power of Knowledge
            </h1>
            <p className="text-text-light mt-4 text-lg md:text-xl">
              Join our community of learners and share your notes, get AI-powered summaries, and collaborate in real-time with other students.
            </p>
            <div className="mt-8">
              <a
                href="/signup"
                className="bg-primary-light text-background px-6 py-3 rounded-md text-lg font-semibold hover:bg-primary transition duration-200"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="ml-4 text-primary-dark px-6 py-3 rounded-md text-lg font-semibold border border-primary-light hover:bg-primary-light hover:text-background transition duration-200"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
            <img
              src="https://via.placeholder.com/500"
              alt="Learning Illustration"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-primary-dark mb-12">
          Why Choose StudySync?
        </h2>
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Feature 1 */}
          <div className="flex-1 text-center bg-background dark:bg-background-dark p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-semibold text-primary">AI Note Generation</h3>
            <p className="text-text mt-2">
              Get AI-powered notes and summaries to boost your productivity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex-1 text-center bg-background dark:bg-background-dark p-6 rounded-md shadow-lg mt-8 md:mt-0">
            <h3 className="text-xl font-semibold text-primary">Community Support</h3>
            <p className="text-text mt-2">
              Connect with other learners in our Q&A and discussion forums.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex-1 text-center bg-background dark:bg-background-dark p-6 rounded-md shadow-lg mt-8 md:mt-0">
            <h3 className="text-xl font-semibold text-primary">Real-Time Collaboration</h3>
            <p className="text-text mt-2">
              Chat and collaborate in real-time with private and group chats.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-6">
        <div className="container mx-auto text-center text-background">
          © 2024 StudySync. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
