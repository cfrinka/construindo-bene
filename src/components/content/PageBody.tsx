"use client";

import { useEffect, useState } from "react";
import { isFirebaseEnabled, getFirebase, subscribeCollection, listCollection } from "@/lib/firebase";
import type { PageKey } from "./PageHeader";

export default function PageBody({ page, className = "" }: { page: PageKey; className?: string }) {
  const enabled = isFirebaseEnabled();
  const [body, setBody] = useState<string>("");

  useEffect(() => {
    let unsub: (() => void) | null = null;
    let mounted = true;
    (async () => {
      const fb = await getFirebase();
      if (!fb) return;
      unsub = await subscribeCollection("content", (items) => {
        if (!mounted) return;
        const found = (items as any[]).find((d) => d?.page === page);
        setBody(String(found?.body || ""));
      });
      const r = await listCollection("content");
      if (mounted && (r as any).ok && Array.isArray((r as any).items)) {
        const found = ((r as any).items as any[]).find((d) => d?.page === page);
        setBody(String(found?.body || ""));
      }
    })();
    return () => { mounted = false; if (unsub) unsub(); };
  }, [page]);

  if (!body) return null;
  return (
    <div className={className}>
      <p className="text-neutral-700 whitespace-pre-line">{body}</p>
    </div>
  );
}
