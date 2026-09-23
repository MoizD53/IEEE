"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BACKGROUND_IMAGES = [
  {
    src: "/campus-bg-1.jpg",
    alt: "Karnavati University - Aerial Campus View",
  },
  {
    src: "/campus-bg-2.jpg",
    alt: "Karnavati University - Unitedworld School of Business & Stained Glass Dome",
  },
  {
    src: "/campus-bg-3.jpg",
    alt: "Karnavati University - Campus Entrance & Iconic Lawn",
  },
];

export default function BackgroundSlideshow({
  intervalMs = 2500,
}: {
  intervalMs?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background Slides with Smooth Cross-fade */}
      {BACKGROUND_IMAGES.map((img, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover object-center scale-[1.02] transition-transform duration-[3000ms] ease-out"
            />
          </div>
        );
      })}

      {/* Gentle clear protective overlay (preserves sharp vivid images while ensuring card text readability) */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Subtle vignette on edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>

      {/* Discreet Slide Indicators */}
      <div className="absolute bottom-3 right-6 z-10 flex items-center gap-2 pointer-events-auto">
        {BACKGROUND_IMAGES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`View background slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-6 bg-white shadow-md"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
