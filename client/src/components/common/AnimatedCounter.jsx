import { animate } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedCounter = ({ value, suffix = "" }) => {
  const numericValue = Number(String(value).replace(/[^\d.-]/g, "")) || 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return () => controls.stop();
  }, [numericValue]);

  return <span>{displayValue}{suffix}</span>;
};
