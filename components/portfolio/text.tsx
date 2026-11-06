import { Fragment, type ReactNode } from "react";

/** « a\nb » devient « a<br/>b » : permet de contrôler les retours à la ligne depuis l'admin. */
export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i, all) => (
        <Fragment key={i}>
          {line}
          {i < all.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

/** « du **gras** » devient du gras : seul balisage autorisé dans les textes éditables. */
export function Rich({ text, as: Tag = "b" }: { text: string; as?: "b" | "strong" }): ReactNode {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <Tag key={i}>{part}</Tag> : <Fragment key={i}>{part}</Fragment>,
  );
}
