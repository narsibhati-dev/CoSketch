import React from 'react';
import HeroSection from './hero-section';
import VideoSection from './video-section';
import FeaturesSection from './FeaturesSection';

const Landing = () => {
  return (
    <main className='flex flex-col items-center justify-center'>
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
    </main>
  );
};

export default Landing;
