"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./FloatingLensOrb.module.scss";

type FloatingLensOrbProps = {
  className?: string;
};

export default function FloatingLensOrb({
  className = "",
}: FloatingLensOrbProps) {
  const orbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!orbRef.current) return;

    const orb = orbRef.current;

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: {
        ease: "sine.inOut",
      },
    });

    tl.to(orb, {
      y: -14,
      x: 8,
      rotate: 3,
      scale: 1.025,
      duration: 3.4,
    }).to(orb, {
      y: 10,
      x: -6,
      rotate: -2.5,
      scale: 0.985,
      duration: 3.1,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className={`${styles.orb} ${className}`.trim()} ref={orbRef} aria-hidden="true">
      <span className={styles.highlightPrimary} />
      <span className={styles.highlightSecondary} />
      <span className={styles.innerRing} />
      <span className={styles.innerGlow} />
    </div>
  );
}