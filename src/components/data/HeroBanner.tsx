"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { H1, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { isFirebaseEnabled, listCollection } from "@/lib/firebase";

function picsum(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export default function HeroBanner() {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const enabled = isFirebaseEnabled();

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        if (enabled) {
          const res = await listCollection("banners");
          if (!cancel && res.ok) {
            const first = (res.items as any[])[0];
            setUrl(first?.url ?? null);
          }
        } else {
          if (!cancel) setUrl(picsum("home-hero", 1000, 800));
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [enabled]);

  const imageUrl = url ?? picsum("home-hero-ph", 1000, 800);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent" />
      <Container className="py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <H1 className="leading-tight">
              Urban Art
              <br />
              <span className="text-brand-primary">Meets</span>
              <br />
              <span className="text-brand-accent">Fashion</span>
            </H1>
            <Text className="mt-4 max-w-xl">
              Peças exclusivas com atitude brasileira. Cores vibrantes, arte urbana e liberdade para se expressar.
            </Text>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/produtos" variant="primary">Comprar agora</Button>
              <Button href="/colecoes" variant="outline">Ver coleções</Button>
            </div>
          </div>
          <div className="relative h-72 md:h-[420px] rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt="Benê Brasil hero"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
