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

const transforms: Record<Direction, string> = {
  up: "translate3d(0, 50px, 0)",
  down: "translate3d(0, -30px, 0)",
  left: "translate3d(-40px, 0, 0)",
  right: "translate3d(40px, 0, 0)",
  scale: "scale(0.95)",
  blur: "translate3d(0, 20px, 0)",
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  className = "",
  threshold = 0.15,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal(threshold);

  const filterVal = direction === "blur" ? "blur(8px)" : "none";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0) scale(1)" : transforms[direction],
        filter: isVisible ? "none" : filterVal,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
