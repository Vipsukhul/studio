'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function AnimatedCounter({ 
  value, 
  className, 
  formatter = (val) => val.toLocaleString('en-IN') 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const animate = (timestamp: number) => {
    if (startTimeRef.current === undefined) {
      startTimeRef.current = timestamp;
    }
    const elapsedTime = timestamp - startTimeRef.current;
    const progress = Math.min(elapsedTime / 1000, 1); // Animate over 1 second
    
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

    const newDisplayValue = Math.floor(easedProgress * value);
    
    setDisplayValue(newDisplayValue);

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    startTimeRef.current = undefined; // Reset start time for each new animation
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [value]);
  
  return (
    <span className={className}>
      {formatter(displayValue)}
    </span>
  );
}
