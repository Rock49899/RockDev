"use client";

import { useEffect, useRef } from "react";

// Blocs qui apparaissent en glissant au fil du défilement (le hero reste visible dès le chargement).
const REVEAL = [
  ".about-grid > *",
  ".section-head",
  ".project",
  ".orbit article",
  ".soft > .section-tag",
  ".soft-grid article",
  ".t-item",
  ".contact-copy",
  ".terminal",
].join(",");

/** Apparition au défilement et barre de progression de lecture. */
export default function ScrollEffects() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--scroll", String(max > 0 ? Math.min(window.scrollY / max, 1) : 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    const items = [...document.querySelectorAll<HTMLElement>(REVEAL)];
    items.forEach((el, i) => {
      el.dataset.reveal = "";
      el.style.setProperty("--i", String(i % 4));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { isIntersecting, target } of entries) {
          if (!isIntersecting) continue;
          target.classList.add("in");
          observer.unobserve(target);
          // Une fois apparu, l'élément retrouve ses propres transitions (survol, etc.).
          setTimeout(() => {
            target.removeAttribute("data-reveal");
            target.classList.remove("in");
          }, 1100);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      items.forEach((el) => el.removeAttribute("data-reveal"));
    };
  }, []);

  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
