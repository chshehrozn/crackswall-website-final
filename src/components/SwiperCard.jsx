"use client";
import { useState, useRef, useEffect } from "react";

export default function SwiperCard({ data }) {
  const images = data?.data?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!images.length) return null;

  const getImageUrl = (item) => {
    if (!item?.image_path) return "";
    if (item.image_path.startsWith("http")) return item.image_path;
    return `${process.env.NEXT_PUBLIC_WEB_URL}/${encodeURI(
      item.image_path.replace(/^public\//, "")
    )}`;
  };

  const goTo = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const goNext = () => {
    if (images.length <= 1) return;
    goTo(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goPrev = () => {
    if (images.length <= 1) return;
    goTo(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  // Touch / swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div className="w-full max-w-[730px] mx-auto">
      {/* Main slider container */}
      <div
        className="relative w-full overflow-hidden rounded-xl bg-gray-100 group"
        style={{ aspectRatio: "730 / 430" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-[400ms] ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((item, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={getImageUrl(item)}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-full object-contain bg-white"
                loading={index === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10"
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10"
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail dots / pagination */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {images.map((item, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 ${index === currentIndex
                ? "w-6 h-2 bg-purple-600"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
