"use client"
function slugify(s?: string) {
  return (s || "")
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}


import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getFirebase, isFirebaseEnabled, listCollection, subscribeCollection } from "@/lib/firebase";
import Container from "@/components/ui/Container";
import { H2 } from "@/components/ui/Typography";

export default function CreatorsFeatured({ dark = false, title = "Conheça os criadores" }: { dark?: boolean; title?: string }) {
  const enabled = isFirebaseEnabled();
  const [doc, setDoc] = useState<any | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    let mounted = true;
    (async () => {
      const fb = await getFirebase();
      if (!fb) return;
      unsub = await subscribeCollection("content", (items) => {
        if (!mounted) return;
        const found = (items as any[]).find((d) => d?.page === "criadores");
        setDoc(found || null);
      });
      const r = await listCollection("content");
      if (mounted && (r as any).ok && Array.isArray((r as any).items)) {
        const found = ((r as any).items as any[]).find((d) => d?.page === "criadores");
        setDoc(found || null);
      }
    })();
    return () => { mounted = false; if (unsub) unsub(); };
  }, []);

  const featured: Array<{ name: string; role?: string; image?: string; href?: string }> = useMemo(
    () => (Array.isArray(doc?.featuredCreators) ? doc.featuredCreators : []),
    [doc]
  );

  if (!featured.length) return null;

  return (
    <section className={`py-16 ${dark ? 'bg-neutral-900 text-white' : ''}`}>
      <Container>
        {title && (
          <div className="flex items-end justify-between gap-4">
            <H2 className={dark ? 'text-white' : ''}>{title}</H2>
          </div>
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c, idx) => (
            <a
              key={idx}
              href={c.href || `/criadores/${slugify(c.name)}`}
              className={`group rounded-lg border overflow-hidden transition ${dark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-neutral-200 hover:shadow-sm'}`}
            >
              <div className="relative h-48 bg-neutral-100">
                {c.image ? (
                  <Image src={c.image} alt={c.name || "Criador"} fill className="object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className={`absolute inset-0 grid place-items-center text-sm ${dark ? 'text-white/60' : 'text-neutral-500'}`}>Sem imagem</div>
                )}
              </div>
              <div className="p-4">
                <div className={`font-medium ${dark ? 'text-white' : ''}`}>{c.name || "Criador"}</div>
                {c.role && <div className={`mt-1 text-sm ${dark ? 'text-white/70' : 'text-neutral-600'}`}>{c.role}</div>}
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
