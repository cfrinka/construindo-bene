"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { motion, useMotionValue, animate, useMotionTemplate } from "framer-motion";

type Props = LinkProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof LinkProps> & {
    activeClassName?: string;
    className?: string;
    exact?: boolean;
  };

export default function NavLink({
  href,
  children,
  className = "",
  activeClassName = "text-white",
  exact = false,
  ...rest
}: Props) {
  const pathname = usePathname();
  const isActive = (() => {
    const h = typeof href === "string" ? href : (href as any).pathname;
    if (!h) return false;
    if (exact) return pathname === h;
    return pathname === h || pathname?.startsWith(h + "/");
  })();

  const COLORS = ["#2A5473", "#BE1622", "#355444"];
  const color = useMotionValue(COLORS[0]);
  useEffect(() => {
    if (!isActive) return;
    const controls = animate(color, COLORS, { ease: "easeInOut", duration: 8, repeat: Infinity, repeatType: "mirror" });
    return () => controls.stop();
  }, [isActive]);

  const underlineBg = useMotionTemplate`${color}`;

  return (
    <Link
      href={href}
      className={`hover:text-white text-lg transition text-white/80 ${isActive ? activeClassName : ""} ${className}`}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      <span className="inline-flex flex-col items-start">
        <span>{children}</span>
        {isActive && (
          <motion.span style={{ backgroundColor: underlineBg }} className="mt-1 block h-1 w-full rounded"></motion.span>
        )}
      </span>
    </Link>
  );
}
