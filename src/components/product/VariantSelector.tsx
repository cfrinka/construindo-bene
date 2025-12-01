"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const ALL_COLORS = [
  { name: "Preto", value: "#000000" },
  { name: "Branco", value: "#FFFFFF" },
  { name: "Cinza", value: "#808080" },
  { name: "Azul", value: "#0000FF" },
  { name: "Vermelho", value: "#FF0000" },
  { name: "Verde", value: "#008000" },
  { name: "Amarelo", value: "#FFFF00" },
];

type VariantSelectorProps = {
  availableSizes: string[];
  availableColors: string[];
  onSelect: (size: string, color: string) => void;
  onCancel: () => void;
};

export default function VariantSelector({ availableSizes, availableColors, onSelect, onCancel }: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Filter colors to only show available ones
  const colors = ALL_COLORS.filter(color => availableColors.includes(color.name));

  const handleConfirm = () => {
    if (selectedSize && selectedColor) {
      onSelect(selectedSize, selectedColor);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-display font-semibold mb-4">Selecione o tamanho e cor</h3>

        {/* Size Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Tamanho</label>
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-md border transition-colors font-medium ${
                  selectedSize === size
                    ? "border-[#2A5473] bg-[#2A5473] text-white"
                    : "border-neutral-300 hover:border-neutral-400 bg-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Cor</label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`flex flex-col items-center gap-1 p-2 rounded-md border transition-colors bg-white ${
                  selectedColor === color.name
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
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleConfirm}
            disabled={!selectedSize || !selectedColor}
          >
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}
