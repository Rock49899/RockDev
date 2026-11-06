import type { ReactNode } from "react";

export type IconName =
  | "home"
  | "user"
  | "work"
  | "code"
  | "mail"
  | "arrow"
  | "download"
  | "github"
  | "linkedin"
  | "menu"
  | "close"
  | "external"
  | "journey"
  | "funnel";

const icons: Record<IconName, ReactNode> = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  user: <><circle cx="12" cy="7" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></>,
  work: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" /></>,
  code: <><path d="m8 9-4 3 4 3m8-6 4 3-4 3M14 5l-4 14" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 7 9-7" /></>,
  arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4M5 21h14" /></>,
  github: <><path d="M15 22v-4c0-1 .4-2-1-3 4 0 7-2 7-6a5 5 0 0 0-1-3 5 5 0 0 0 0-4s-2 0-4 2a13 13 0 0 0-8 0C6 2 4 2 4 2a5 5 0 0 0 0 4 5 5 0 0 0-1 3c0 4 3 6 7 6-1 1-1 2-1 3v4" /><path d="M9 19c-3 1-3-2-5-2" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7M7 7v.01M11 17v-7m0 3c1-4 6-4 6 1v3" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m5 5 14 14M19 5 5 19" /></>,
  journey: <><path d="M12 3v18" /><circle cx="12" cy="7" r="2.5" /><circle cx="12" cy="17" r="2.5" /><path d="M15 7h5M4 17h5" /></>,
  funnel: <><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z" /></>,
  external: <><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}
