import { ReactNode } from "react";

export function H1({ children, className = "", size }: { children: ReactNode; className?: string; size?: string }) {
  const sizeClass = size || "text-4xl md:text-5xl";
  return <h1 className={`${sizeClass} font-display font-extrabold tracking-normal text-neutral-900 ${className}`}>{children}</h1>;
}

export function H2({ children, className = "", size }: { children: ReactNode; className?: string; size?: string }) {
  const sizeClass = size || "text-2xl md:text-3xl";
  return <h2 className={`${sizeClass} font-display font-bold tracking-wide text-neutral-900 ${className}`}>{children}</h2>;
}

export function Text({ children, className = "", size }: { children: ReactNode; className?: string; size?: string }) {
  const sizeClass = size || "";
  return <p className={`${sizeClass} text-neutral-600 ${className}`}>{children}</p>;
}

export default { H1, H2, Text };
