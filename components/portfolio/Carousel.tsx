"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

type Props = {
  images: string[];
  title: string;
  /** `card` : diaporama discret dans la liste ; `stage` : galerie complète de la page projet. */
  mode: "card" | "stage";
  /** Décale le démarrage pour que les cartes ne défilent pas toutes en même temps. */
  offset?: number;
  priority?: boolean;
};

const INTERVAL = { card: 4200, stage: 5200 };

export default function Carousel({ images, title, mode, offset = 0, priority = false }: Props) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Le diaporama ne tourne que lorsqu'il est visible à l'écran.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const playing = count > 1 && visible && !paused && !reduced;

  // Une minuterie par diapositive : un clic manuel remet naturellement le compte à zéro.
  useEffect(() => {
    if (!playing) return;
    const wait = INTERVAL[mode] + (index === 0 ? offset : 0);
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), wait);
    return () => clearTimeout(timer);
  }, [playing, index, count, mode, offset]);

  const slides = images.map((src, i) => (
    <div key={src} className={i === index ? "slide active" : "slide"} aria-hidden={i !== index}>
      <Image
        src={src}
        alt={`${title} — image ${i + 1} sur ${count}`}
        fill
        sizes={mode === "card" ? "(max-width: 720px) 90vw, 340px" : "(max-width: 1000px) 90vw, 1100px"}
        priority={priority && i === 0}
      />
    </div>
  ));

  if (mode === "card") {
    return (
      <div className="carousel" ref={root}>
        {slides}
        {count > 1 && (
          <div className="carousel-dots" aria-hidden="true">
            {images.map((src, i) => (
              <i key={src} className={i === index ? "on" : ""} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className="stage"
        ref={root}
        role="region"
        aria-roledescription="carrousel"
        aria-label={`Images du projet ${title}`}
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(index + 1);
          if (event.key === "ArrowLeft") go(index - 1);
        }}
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchX.current === null) return;
          const delta = event.changedTouches[0].clientX - touchX.current;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <div className="carousel">{slides}</div>
        {count > 1 && (
          <>
            <button className="stage-btn prev" onClick={() => go(index - 1)} aria-label="Image précédente">
              <Icon name="arrow" />
            </button>
            <button className="stage-btn next" onClick={() => go(index + 1)} aria-label="Image suivante">
              <Icon name="arrow" />
            </button>
            <div className="stage-bar">
              <div className="dots">
                {images.map((src, i) => (
                  <button
                    key={src}
                    className={i === index ? "on" : ""}
                    onClick={() => go(i)}
                    aria-label={`Aller à l'image ${i + 1}`}
                    aria-current={i === index}
                  />
                ))}
              </div>
              <span aria-live="polite">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <button
                className="stage-play"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Reprendre le défilement" : "Mettre le défilement en pause"}
              >
                {paused ? "▶" : "❚❚"}
              </button>
            </div>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="thumbs">
          {images.map((src, i) => (
            <button key={src} className={i === index ? "on" : ""} onClick={() => go(i)} aria-label={`Image ${i + 1}`}>
              <Image src={src} alt="" fill sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
