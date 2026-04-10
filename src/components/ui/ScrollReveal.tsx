"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

type Direction = "up" | "down" | "left" | "right" | "scale" | "blur";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  className = "",
  threshold = 0.1,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal(threshold);

  // Animation class based on direction — elements are VISIBLE by default
  // and only get the animation class once they enter the viewport
  const animationClass = isVisible
    ? `animate-reveal-${direction}`
    : "";

  return (
    <div
      ref={ref}
      className={`${className} ${animationClass}`}
      style={{
        animationDelay: isVisible ? `${delay}ms` : undefined,
        animationDuration: isVisible ? `${duration}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}
