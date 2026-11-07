import {
  siChartdotjs,
  siDocker,
  siFigma,
  siGit,
  siGithub,
  siGitlab,
  siHtml5,
  siJavascript,
  siLaravel,
  siMake,
  siMongodb,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siSqlite,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";

const ICONS: Record<string, SimpleIcon> = {
  react: siReact,
  "vue.js": siVuedotjs,
  vue: siVuedotjs,
  typescript: siTypescript,
  javascript: siJavascript,
  "tailwind css": siTailwindcss,
  tailwind: siTailwindcss,
  html5: siHtml5,
  laravel: siLaravel,
  php: siPhp,
  "node.js": siNodedotjs,
  nestjs: siNestjs,
  "next.js": siNextdotjs,
  mysql: siMysql,
  postgresql: siPostgresql,
  sqlite: siSqlite,
  mongodb: siMongodb,
  git: siGit,
  github: siGithub,
  gitlab: siGitlab,
  make: siMake,
  "chart.js": siChartdotjs,
  figma: siFigma,
  supabase: siSupabase,
  vercel: siVercel,
  vite: siVite,
  docker: siDocker,
  python: siPython,
};

function iconFor(name: string) {
  const key = name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .trim();
  return ICONS[key] ?? ICONS[key.split(/\s*\/\s*/)[0]];
}

// Les marques très sombres disparaissent sur le fond du site : on les affiche dans la couleur du texte.
function isDark(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.1;
}

export function TechLogo({ name }: { name: string }) {
  const icon = iconFor(name);
  if (!icon) return null;

  return (
    <svg
      className="tech-logo"
      viewBox="0 0 24 24"
      width="1.15em"
      height="1.15em"
      role="img"
      aria-hidden="true"
      style={{ fill: isDark(icon.hex) ? "currentColor" : `#${icon.hex}`, stroke: "none" }}
    >
      <path d={icon.path} />
    </svg>
  );
}
