"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { updateDocument } from "@/lib/firebase";
import { useToast } from "@/components/ui/Toast";

const AVAILABLE_SIZES = ["P", "M", "G", "GG", "G1"];
const AVAILABLE_COLORS = [
  { name: "Preto", value: "#000000" },
  { name: "Branco", value: "#FFFFFF" },
  { name: "Cinza", value: "#808080" },
  { name: "Azul", value: "#0000FF" },
  { name: "Vermelho", value: "#FF0000" },
  { name: "Verde", value: "#008000" },
  { name: "Amarelo", value: "#FFFF00" },
];

type Product = {
  id: string;
  title?: string;
  price?: number;
  cover?: string;
  sizes?: string[];
  colors?: string[];
};

type EditProductModalProps = {
  product: Product;
  onClose: () => void;
  onSave: () => void;
};

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [sizes, setSizes] = useState<string[]>(product.sizes || []);
  const [colors, setColors] = useState<string[]>(product.colors || []);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  const toggleSize = (size: string) => {
    setSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setColors(prev =>
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const handleSave = async () => {
    if (sizes.length === 0) {
      show({ variant: 'warning', title: 'Selecione pelo menos um tamanho' });
      return;
    }
    if (colors.length === 0) {
      show({ variant: 'warning', title: 'Selecione pelo menos uma cor' });
      return;
    }

    setSaving(true);
    try {
      await updateDocument('products', product.id, {
        sizes,
        colors,
      });
      show({ variant: 'success', title: 'Produto atualizado' });
      onSave();
      onClose();
    } catch (error) {
      show({ variant: 'error', title: 'Erro ao atualizar produto' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-display font-semibold mb-4">
          Editar Variantes: {product.title}
        </h2>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Tamanhos disponíveis *
          </label>
          <div className="flex gap-2 flex-wrap">
            {AVAILABLE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-md border transition-colors font-medium ${
                  sizes.includes(size)
                    ? "border-[#2A5473] bg-[#2A5473] text-white"
                    : "border-neutral-300 hover:border-neutral-400 bg-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {sizes.length > 0 && (
            <p className="text-xs text-neutral-600 mt-2">
              Selecionados: {sizes.join(", ")}
            </p>
          )}
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Cores disponíveis *
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                className={`flex flex-col items-center gap-1 p-2 rounded-md border transition-colors bg-white ${
                  colors.includes(color.name)
                    ? "border-[#2A5473] ring-2 ring-[#2A5473]/20"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-neutral-300"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-neutral-800">{color.name}</span>
              </button>
            ))}
          </div>
          {colors.length > 0 && (
            <p className="text-xs text-neutral-600 mt-2">
              Selecionadas: {colors.join(", ")}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || sizes.length === 0 || colors.length === 0}
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
