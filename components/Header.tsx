"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "philosophy", label: "Philosophy" },
  { id: "contact", label: "Contact" },
];

type HeaderProps = {
  onNavigate?: (sectionId: string) => void;
};

export default function Header({ onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);

  const overlayRef = useRef<HTMLButtonElement | null>(null);

  const menuPanelRef = useRef<HTMLElement | null>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const indexPanelRef = useRef<HTMLElement | null>(null);

  const topLineRef = useRef<HTMLSpanElement | null>(null);
  const middleLineRef = useRef<HTMLSpanElement | null>(null);
  const bottomLineRef = useRef<HTMLSpanElement | null>(null);

  const closeAll = () => {
    setMenuOpen(false);
    setIndexOpen(false);
  };

  const handleSectionClick = (sectionId: string) => {
    closeAll();

    window.setTimeout(() => {
      onNavigate?.(sectionId);
    }, 180);
  };

  useEffect(() => {
    if (!overlayRef.current || !menuPanelRef.current) return;

    if (menuOpen) {
      gsap.killTweensOf([
        overlayRef.current,
        menuPanelRef.current,
        ...menuItemsRef.current,
        topLineRef.current,
        middleLineRef.current,
        bottomLineRef.current,
      ]);

      gsap.set(overlayRef.current, {
        pointerEvents: "auto",
      });

      gsap.set(menuPanelRef.current, {
        pointerEvents: "auto",
      });

      gsap.timeline()
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.28,
          ease: "power2.out",
        })
        .to(
          menuPanelRef.current,
          {
            x: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0
        )
        .to(
          topLineRef.current,
          {
            y: 7,
            rotate: 45,
            duration: 0.35,
            ease: "power2.out",
            transformOrigin: "center center",
          },
          0
        )
        .to(
          middleLineRef.current,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
          },
          0
        )
        .to(
          bottomLineRef.current,
          {
            y: -7,
            rotate: -45,
            duration: 0.35,
            ease: "power2.out",
            transformOrigin: "center center",
          },
          0
        )
        .fromTo(
          menuItemsRef.current.filter(Boolean),
          {
            y: 24,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.14
        );
    } else {
      gsap.killTweensOf([
        overlayRef.current,
        menuPanelRef.current,
        ...menuItemsRef.current,
        topLineRef.current,
        middleLineRef.current,
        bottomLineRef.current,
      ]);

      gsap.timeline()
        .to(menuItemsRef.current.filter(Boolean), {
          y: 16,
          opacity: 0,
          duration: 0.18,
          stagger: 0.04,
          ease: "power2.in",
        })
        .to(
          menuPanelRef.current,
          {
            x: "-100%",
            duration: 0.42,
            ease: "power3.inOut",
          },
          0.05
        )
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => {
              if (overlayRef.current && !menuOpen && !indexOpen) {
                gsap.set(overlayRef.current, { pointerEvents: "none" });
              }
            },
          },
          0.08
        )
        .to(
          topLineRef.current,
          {
            y: 0,
            rotate: 0,
            duration: 0.28,
            ease: "power2.out",
          },
          0
        )
        .to(
          middleLineRef.current,
          {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
          },
          0
        )
        .to(
          bottomLineRef.current,
          {
            y: 0,
            rotate: 0,
            duration: 0.28,
            ease: "power2.out",
          },
          0
        )
        .set(menuPanelRef.current, {
          pointerEvents: "none",
        });
    }
  }, [menuOpen, indexOpen]);

  useEffect(() => {
    if (!overlayRef.current || !indexPanelRef.current) return;

    if (indexOpen) {
      gsap.killTweensOf([overlayRef.current, indexPanelRef.current]);

      gsap.set(overlayRef.current, {
        pointerEvents: "auto",
      });

      gsap.set(indexPanelRef.current, {
        pointerEvents: "auto",
      });

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.16,
        ease: "power1.out",
      });

      gsap.to(indexPanelRef.current, {
        opacity: 1,
        duration: 0.16,
        ease: "power1.out",
      });
    } else {
      gsap.killTweensOf([overlayRef.current, indexPanelRef.current]);

      gsap.timeline()
        .to(indexPanelRef.current, {
          opacity: 0,
          duration: 0.12,
          ease: "power1.out",
        })
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.12,
            ease: "power1.out",
            onComplete: () => {
              if (overlayRef.current && !menuOpen && !indexOpen) {
                gsap.set(overlayRef.current, { pointerEvents: "none" });
              }
            },
          },
          0
        )
        .set(indexPanelRef.current, {
          pointerEvents: "none",
        });
    }
  }, [indexOpen, menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full">
        <div className="px-4 pt-4 md:px-8 md:pt-6">
          <div className="relative flex items-center justify-between rounded-full border border-black/10 bg-white/70 px-4 py-3 backdrop-blur-md md:px-6">
            <button
              type="button"
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setIndexOpen(false);
              }}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] md:text-sm"
              aria-label="Open menu"
            >
              <span className="relative flex h-4 w-5 flex-col justify-between">
                <span ref={topLineRef} className="block h-px w-5 bg-black" />
                <span ref={middleLineRef} className="block h-px w-5 bg-black" />
                <span ref={bottomLineRef} className="block h-px w-5 bg-black" />
              </span>
              <span>{menuOpen ? "Close" : "Menu"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSectionClick("hero")}
              className="absolute left-1/2 -translate-x-1/2 text-sm uppercase tracking-[0.28em] md:text-base"
            >
              EUNSU
            </button>

            <button
              type="button"
              onClick={() => {
                setIndexOpen((prev) => !prev);
                setMenuOpen(false);
              }}
              className="text-xs uppercase tracking-[0.18em] md:text-sm"
              aria-label="Open section index"
            >
              {indexOpen ? "Close" : "Index"}
            </button>
          </div>
        </div>
      </header>

      <button
        ref={overlayRef}
        type="button"
        onClick={closeAll}
        className="fixed inset-0 z-40 bg-black/20 opacity-0 pointer-events-none backdrop-blur-[2px]"
        aria-label="Close overlay"
      />

      <aside
        ref={menuPanelRef}
        className="fixed top-0 left-0 z-50 h-screen w-[82%] max-w-sm -translate-x-full bg-[#f5f1ea] p-6 shadow-2xl md:p-8"
        style={{ pointerEvents: "none" }}
      >
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <p className="text-xs uppercase tracking-[0.18em]">Menu</p>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="text-xs uppercase tracking-[0.18em]"
          >
            Close
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-5">
          {sections.map((section, index) => (
            <button
              key={section.id}
              ref={(el) => {
                menuItemsRef.current[index] = el;
              }}
              type="button"
              onClick={() => handleSectionClick(section.id)}
              className="text-left text-2xl tracking-[-0.03em] opacity-0 md:text-4xl"
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      <aside
        ref={indexPanelRef}
        className="fixed top-[84px] right-4 z-50 w-[220px] rounded-3xl border border-black/10 bg-white/85 p-4 shadow-xl opacity-0 backdrop-blur-md md:right-8 md:p-5"
        style={{ pointerEvents: "none" }}
      >
        <div className="mb-3 border-b border-black/10 pb-3">
          <p className="text-xs uppercase tracking-[0.18em]">Sections</p>
        </div>

        <nav className="flex flex-col gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => handleSectionClick(section.id)}
              className="rounded-2xl px-3 py-2 text-left text-sm uppercase tracking-[0.14em] transition hover:bg-black hover:text-white"
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}