"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { listCollection, isFirebaseEnabled } from "@/lib/firebase";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import AuthModal from "@/components/ui/AuthModal";
import VariantSelector from "@/components/product/VariantSelector";

function picsum(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

type Product = {
  id?: string;
  title?: string;
  price?: number;
  cover?: string;
  badge?: string;
  sizes?: string[];
  colors?: string[];
};

export default function ProductsGrid({ limit = 6, cols = "sm:grid-cols-2 lg:grid-cols-3" }: { limit?: number; cols?: string }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const enabled = isFirebaseEnabled();
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        if (enabled) {
          const res = await listCollection("products");
          if (!cancel && res.ok) setItems(res.items as any);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [enabled, limit]);

  const data = items.slice(0, limit);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setPendingProduct(product);
      setAuthModalOpen(true);
      return;
    }

    // Check if product has variants configured
    if (!product.sizes || product.sizes.length === 0 || !product.colors || product.colors.length === 0) {
      alert("Este produto ainda não tem tamanhos e cores configurados. Entre em contato com o administrador.");
      return;
    }

    // Open variant selector
    setPendingProduct(product);
    setVariantModalOpen(true);
  };

  const handleVariantSelect = (size: string, color: string) => {
    if (pendingProduct) {
      addItem({
        id: pendingProduct.id || "",
        title: pendingProduct.title,
        price: pendingProduct.price,
        cover: pendingProduct.cover,
        size,
        color,
      });
      setPendingProduct(null);
      setVariantModalOpen(false);
      router.push("/carrinho");
    }
  };

  const handleAuthSuccess = () => {
    if (pendingProduct) {
      // After auth, open variant selector
      setVariantModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className={`grid gap-6 ${cols}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${cols}`}>
      {data.map((p: Product, i) => (
        <Card key={p.id ?? i} className="overflow-hidden">
          <div className="relative h-56 bg-neutral-100">
            <Image src={p.cover ?? picsum(`prod-${i}`, 800, 800)} alt={p.title ?? "Produto"} fill className="object-cover" />
            {p.badge && (
              <div className="absolute left-3 top-3">
                <Badge className="bg-brand-accent text-white">{p.badge}</Badge>
              </div>
            )}
          </div>
          <CardBody>
            <h3 className="font-display font-semibold text-xl tracking-wide">{p.title ?? "Produto"}</h3>
            <p className="mt-1 text-sm text-neutral-600">Algodão premium • Unissex</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[#1f9d61] font-semibold">R$ {(p.price ?? 0).toFixed(2)}</span>
              <Button size="sm" onClick={() => handleAddToCart(p)}>Adicionar</Button>
            </div>
          </CardBody>
        </Card>
      ))}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {variantModalOpen && pendingProduct && (
        <VariantSelector
          availableSizes={pendingProduct.sizes || []}
          availableColors={pendingProduct.colors || []}
          onSelect={handleVariantSelect}
          onCancel={() => {
            setVariantModalOpen(false);
            setPendingProduct(null);
          }}
        />
      )}
    </div>
  );
}
