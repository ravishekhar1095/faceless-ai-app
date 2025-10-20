import React, { useState, useEffect, useRef } from 'react';

const StatCounter = ({ end, duration = 2000, suffix = '', isVisible }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      let start = 0;
      const endValue = parseInt(end.toString().replace(/,/g, ''));
      if (start === endValue) return;

      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentCount = Math.floor(progress * (endValue - start) + start);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue); // Ensure it ends on the exact value
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, end, duration]);

  return (
    <h3>{count.toLocaleString()}{suffix}</h3>
  );
};

export default StatCounter;