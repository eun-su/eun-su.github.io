"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./FloatingBlurOrb.module.scss";

type FloatingBlurOrbProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function FloatingBlurOrb({
  className = "",
  size = "md",
}: FloatingBlurOrbProps) {
  const orbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!orbRef.current) return;

    const orb = orbRef.current;

    let currentOffsetY = 0;
    let targetOffsetY = 0;
    let lastScrollY = window.scrollY;

    const floatTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: {
        ease: "sine.inOut",
      },
    });

    floatTl
      .to(orb, {
        x: 10,
        y: -14,
        scale: 1.04,
        duration: 4.6,
      })
      .to(orb, {
        x: -8,
        y: 12,
        scale: 0.97,
        duration: 4.1,
      });

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;

      // 스크롤 변화량에 반응해서 살짝 뒤늦게 따라오는 오프셋
      targetOffsetY += delta * -0.18;

      // 너무 많이 튀지 않도록 제한
      targetOffsetY = gsap.utils.clamp(-36, 36, targetOffsetY);
    };

    const ticker = () => {
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.085;
      targetOffsetY *= 0.92;

      gsap.set(orb, {
        yPercent: 0,
        "--orb-lag-y": `${currentOffsetY}px`,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    gsap.ticker.add(ticker);

    return () => {
      floatTl.kill();
      window.removeEventListener("scroll", handleScroll);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <div
      ref={orbRef}
      className={`${styles.orb} ${styles[size]} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}