"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { listCollection, isFirebaseEnabled } from "@/lib/firebase";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Typography";
import { CollectionCardSkeleton } from "@/components/ui/Skeleton";

function picsum(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

type Collection = {
  id?: string;
  title?: string;
  slug?: string;
  cover?: string;
  description?: string;
};

export default function CollectionsGrid({ limit = 6, cols = "sm:grid-cols-2 lg:grid-cols-3" }: { limit?: number; cols?: string }) {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const enabled = isFirebaseEnabled();

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        if (enabled) {
          const res = await listCollection("collections");
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
          <CollectionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${cols}`}>
      {data.map((c: Collection, i) => (
        <Card key={c.id ?? i} className="overflow-hidden">
          <div className="relative h-48">
            <Image src={c.cover ?? picsum(`col-${i}`, 800, 500)} alt={c.title ?? "Coleção"} fill className="object-cover" />
          </div>
          <CardBody>
            <h3 className="text-2xl font-display font-semibold">{c.title ?? "Coleção"}</h3>
            <Text className="mt-1">{c.description ?? "Cápsulas limitadas com estética de rua."}</Text>
            <div className="mt-4">
              <Button href={`/colecoes/${c.slug || c.id}`} size="sm">Ver coleção</Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
