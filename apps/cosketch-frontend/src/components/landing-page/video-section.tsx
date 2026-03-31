'use client';

import { useEffect, useRef, useCallback } from 'react';
import { fraunces } from '@/data/fonts';

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (videoRef.current) {
        if (entry.isIntersecting) {
          if (videoRef.current.paused) {
            requestAnimationFrame(() => {
              videoRef.current
                ?.play()
                .catch(e => console.error('Play error:', e));
            });
          }
        } else {
          if (!videoRef.current.paused) {
            requestAnimationFrame(() => {
              videoRef.current?.pause();
            });
          }
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(handleVideoObserver, {
      threshold: 0.5,
    });

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [handleVideoObserver]);

  return (
    <section
      id='demo'
      className='w-full scroll-mt-20 bg-[#f2ede2] px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20'
    >
      {/* Section header */}
      <div className='mx-auto mb-10 max-w-2xl text-center sm:mb-12'>
        <span className='mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#e04e1f]'>
          See it in action
        </span>
        <h2
          className={`${fraunces.className} text-2xl font-semibold text-[#1a1916] sm:text-3xl md:text-4xl`}
        >
          Watch how it works
        </h2>
      </div>

      {/* Video */}
      <div className='mx-auto w-full max-w-5xl'>
        <div className='relative overflow-hidden rounded-2xl shadow-xl shadow-[#1a1916]/10 ring-1 ring-[#1a1916]/8'>
          <video
            ref={videoRef}
            className='h-full w-full rounded-2xl object-cover'
            muted
            loop
            playsInline
            preload='auto'
            poster='/video-poster.webp'
            onCanPlay={() => {
              if (videoRef.current?.paused) {
                videoRef.current.playbackRate = 2;
                requestAnimationFrame(() => {
                  videoRef.current
                    ?.play()
                    .catch(e => console.error('Autoplay prevented:', e));
                });
              }
            }}
          >
            <source src='/COSKETCH.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
