"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProductsTab from "@/components/tabs/ProductsTab";
import CollectionsTab from "@/components/tabs/CollectionsTab";
import HighlightsTab from "@/components/tabs/HighlightsTab";
import ContentTab, { type ContentTabHandle } from "@/components/tabs/ContentTab";
import OrdersTab from "@/components/tabs/OrdersTab";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const tabs = ["Produtos", "Coleções", "Destaques", "Pedidos", "Conteúdo"] as const;
  const [active, setActive] = useState<typeof tabs[number]>("Produtos");
  const contentRef = useRef<ContentTabHandle | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Check if user has admin role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to home
        router.push("/");
      } else if (user.role !== "admin") {
        // Logged in but not admin, redirect to home
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <main className="p-6">
        <div className="max-w-5xl mx-auto text-center py-20">
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </main>
    );
  }

  // Don't render admin content if not authorized
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-200">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActive(t)}
                className={`-mb-px px-3 py-2 text-sm border-b-2 ${active === t ? 'border-black font-medium' : 'border-transparent text-neutral-600 hover:text-black'}`}
              >
                {t}
              </button>
            ))}
          </div>
          {active === "Conteúdo" && (
            <Button
              variant="danger"
              onClick={async () => { await contentRef.current?.save(); }}
              className="!bg-red-600 hover:!bg-red-700"
            >
              Salvar alterações
            </Button>
          )}
        </div>

        <div className="mt-6">
          {active === "Produtos" && <ProductsTab />}

          {active === "Coleções" && <CollectionsTab />}

          {active === "Destaques" && <HighlightsTab />}

          {active === "Pedidos" && <OrdersTab />}

          {active === "Conteúdo" && <ContentTab ref={contentRef} />}
        </div>
      </div>
    </main>
  );
}
