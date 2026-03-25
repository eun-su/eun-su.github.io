"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import styles from "./Header.module.scss";

const menuPages = [
  { href: "/intro", label: "Intro" },
  { href: "/design", label: "Design Works" },
  { href: "/study", label: "Study Notes" },
  { href: "/issues", label: "Issue Board" },
  { href: "/favorites", label: "Favorites" },
];

const indexSections = [
  { id: "cover", label: "Cover" },
  { id: "intro", label: "Intro" },
  { id: "work-cards", label: "Works" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "contact", label: "Contact" },
];

type HeaderProps = {
  onNavigate?: (sectionId: string) => void;
};

export default function Header({ onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  const overlayRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLElement | null>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const indexPanelRef = useRef<HTMLElement | null>(null);

  const topLineRef = useRef<HTMLSpanElement | null>(null);
  const middleLineRef = useRef<HTMLSpanElement | null>(null);
  const bottomLineRef = useRef<HTMLSpanElement | null>(null);

  const triggerPageTransition = (href: string) => {
    window.dispatchEvent(
      new CustomEvent("app:navigate", {
        detail: { href },
      })
    );
  };

  const closeAll = () => {
    setMenuOpen(false);
    setIndexOpen(false);
  };

  const handleSectionClick = (sectionId: string) => {
    closeAll();

    window.setTimeout(() => {
      if (isHome) {
        onNavigate?.(sectionId);
      } else {
        triggerPageTransition(`/#${sectionId}`);
      }
    }, 180);
  };

  const handlePageClick = (href: string) => {
    closeAll();

    window.setTimeout(() => {
      triggerPageTransition(href);
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
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.bar}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setIndexOpen(false);
              }}
              className={styles.menuButton}
              aria-label="Open menu"
            >
              <span className={styles.hamburger}>
                <span ref={topLineRef} className={styles.hamburgerLine} />
                <span ref={middleLineRef} className={styles.hamburgerLine} />
                <span ref={bottomLineRef} className={styles.hamburgerLine} />
              </span>
              <span>{menuOpen ? "Close" : "Menu"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isHome) {
                  handleSectionClick("cover");
                } else {
                  triggerPageTransition("/");
                }
              }}
              className={styles.logo}
            >
              EUNSU
            </button>

            {isHome ? (
              <button
                type="button"
                onClick={() => {
                  setIndexOpen((prev) => !prev);
                  setMenuOpen(false);
                }}
                className={styles.sideButton}
                aria-label="Open section index"
              >
                {indexOpen ? "Close" : "Index"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => triggerPageTransition("/")}
                className={styles.sideButton}
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      <button
        ref={overlayRef}
        type="button"
        onClick={closeAll}
        className={styles.overlay}
        aria-label="Close overlay"
      />

      <aside
        ref={menuPanelRef}
        className={styles.menuPanel}
        style={{ pointerEvents: "none" }}
      >
        <div className={styles.menuPanelTop}>
          <p className={styles.menuPanelTitle}>Menu</p>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className={styles.menuPanelClose}
          >
            Close
          </button>
        </div>

        <nav className={styles.menuNav}>
          {menuPages.map((page, index) => (
            <button
              key={page.href}
              ref={(el) => {
                menuItemsRef.current[index] = el;
              }}
              type="button"
              onClick={() => handlePageClick(page.href)}
              className={styles.menuItem}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </aside>

      {isHome && (
        <aside
          ref={indexPanelRef}
          className={styles.indexPanel}
          style={{ pointerEvents: "none" }}
        >
          <div className={styles.indexPanelHead}>
            <p className={styles.indexPanelTitle}>Sections</p>
          </div>

          <nav className={styles.indexNav}>
            {indexSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSectionClick(section.id)}
                className={styles.indexItem}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
}