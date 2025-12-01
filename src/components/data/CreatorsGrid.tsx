"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { listCollection, isFirebaseEnabled } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { CreatorCardSkeleton } from "@/components/ui/Skeleton";

function picsum(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

function slugify(s?: string) {
  return (s || "")
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type Creator = {
  id?: string;
  name?: string;
  avatar?: string;
  subtitle?: string;
};

export default function CreatorsGrid({ limit = 6, cols = "sm:grid-cols-2 lg:grid-cols-3", dark = false }: { limit?: number; cols?: string; dark?: boolean }) {
  const [items, setItems] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const enabled = isFirebaseEnabled();

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        if (enabled) {
          const res = await listCollection("creators");
          if (!cancel && res.ok) setItems(res.items as any);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [enabled, limit]);

  const data = items.slice(0, limit);

  if (loading) {
    return (
      <div className={`grid gap-6 ${cols}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <CreatorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${cols}`}>
      {data.map((c: Creator, i) => (
        <div key={c.id ?? i} className={`rounded-xl border ${dark ? 'border-white/10 bg-white/5' : 'border-neutral-200 bg-white'} p-6`}>
          <a href={`/criadores/${c.id || (c as any).slug || slugify(c.name)}`} className="block">
            <div className="relative h-40 w-full overflow-hidden rounded-lg">
              <Image src={c.avatar ?? picsum(`creator-${i}`, 800, 600)} alt={c.name ?? 'Criador'} fill className="object-cover" />
            </div>
          </a>
          <h3 className={`mt-4 text-lg font-display font-semibold ${dark ? 'text-white' : ''}`}>{c.name ?? 'Criador'}</h3>
          <p className={`mt-1 text-sm ${dark ? 'text-white/70' : 'text-neutral-600'}`}>{c.subtitle ?? 'Ilustração • Street + Pop'}</p>
          <div className="mt-4 flex gap-2">
            <Button href={`/criadores/${c.id || (c as any).slug || slugify(c.name)}`} size="sm" className={dark ? 'bg-white text-neutral-900 hover:bg-white/90' : ''}>Detalhes</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
