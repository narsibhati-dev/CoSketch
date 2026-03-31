import React from 'react';
import HeroSection from './hero-section';
import VideoSection from './video-section';
import FeaturesSection from './FeaturesSection';

const Landing = () => {
  return (
    <main className='w-full overflow-x-hidden'>
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
    </main>
  );
};

export default Landing;
