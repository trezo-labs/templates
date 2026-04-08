import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const spring = useSpring(0, {
    stiffness: 60, // slower acceleration
    damping: 20, // smoother stop
    mass: 1, // adds weight (natural easing)
  });

  const display = useTransform(spring, (latest) =>
    Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const scale = value >= 1_000_000 ? 0.85 : 1;

  return (
    <motion.span
      className={className}
      animate={{ scale }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      {display}
    </motion.span>
  );
}
