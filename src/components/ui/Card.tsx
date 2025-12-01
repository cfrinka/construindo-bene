import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-xl bg-white border border-neutral-200 ${className}`}>{children}</article>;
}

export function CardMedia({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export default { Card, CardMedia, CardBody };
