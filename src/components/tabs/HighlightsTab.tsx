"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardBody, CardMedia } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { isFirebaseEnabled, getFirebase, subscribeCollection, listCollection, deleteDocument } from "@/lib/firebase";

type Product = { id: string; title?: string; price?: number; cover?: string };
type Highlight = { id: string; productId?: string; title?: string; subtitle?: string; cover?: string };

export default function HighlightsTab() {
  const enabled = isFirebaseEnabled();
  const { show } = useToast();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let unH: (() => void) | null = null;
    let unP: (() => void) | null = null;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const fb = await getFirebase();
        if (!fb) { setError("Firebase não inicializou."); setLoading(false); return; }
        unH = await subscribeCollection("highlights", (items) => { if (!mounted) return; setHighlights(items as Highlight[]); setLoading(false); });
        unP = await subscribeCollection("products", (items) => { if (!mounted) return; setProducts(items as Product[]); });
        const [rh, rp] = await Promise.all([listCollection("highlights"), listCollection("products")]);
        if (mounted) {
          if ((rh as any).ok && Array.isArray((rh as any).items)) setHighlights((rh as any).items as Highlight[]);
          if ((rp as any).ok && Array.isArray((rp as any).items)) setProducts((rp as any).items as Product[]);
        }
      } catch (e: any) {
        if (!mounted) return; setError(e?.message || "Erro ao carregar destaques");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; if (unH) unH(); if (unP) unP(); };
  }, []);

  const productMap = useMemo(() => Object.fromEntries(products.map(p => [p.id, p])), [products]);

  async function removeHighlight(id?: string) {
    if (!enabled || !id) return;
    await deleteDocument('highlights', id);
    show({ variant: 'success', title: 'Removido dos destaques' });
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-4">Destaques</h1>
      {!enabled && <div className="text-sm text-neutral-600">Firebase desativado.</div>}
      {enabled && loading && <div className="text-sm text-neutral-600">Carregando destaques...</div>}
      {enabled && !!error && <div className="text-sm text-red-600">{error}</div>}
      {enabled && !loading && !error && highlights.length === 0 && (
        <div className="text-sm text-neutral-600">Nenhum destaque.</div>
      )}
      {highlights.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => {
            const p = h.productId ? productMap[h.productId] : undefined;
            const title = h.title || p?.title || 'Destaque';
            const cover = h.cover || p?.cover;
            return (
              <Card key={h.id} className="overflow-hidden">
                <CardMedia className="h-48 bg-neutral-100">
                  {cover ? (
                    <Image src={cover} alt={title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">Sem imagem</div>
                  )}
                </CardMedia>
                <CardBody>
                  <div className="font-medium truncate">{title}</div>
                  {h.subtitle && <div className="text-sm text-neutral-600 truncate">{h.subtitle}</div>}
                  <div className="mt-3">
                    <Button size="sm" variant="danger" onClick={() => removeHighlight(h.id)}>Remover</Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
