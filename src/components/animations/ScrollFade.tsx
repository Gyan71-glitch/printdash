"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ScrollFadeProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function ScrollFade({ children, delay = 0, direction = "up", ...props }: ScrollFadeProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 40, opacity: 0 };
      case "down": return { y: -40, opacity: 0 };
      case "left": return { x: 40, opacity: 0 };
      case "right": return { x: -40, opacity: 0 };
      case "none": return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] // Custom ease-out curve for premium feel
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
