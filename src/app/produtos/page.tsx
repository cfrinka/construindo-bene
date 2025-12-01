import Image from "next/image";
import Container from "@/components/ui/Container";
import { H1, Text } from "@/components/ui/Typography";
import ProductsGrid from "@/components/data/ProductsGrid";

export default function ProdutosPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent" />
        <Container className="relative py-16">
          <H1>Mais vendidos</H1>
          <Text className="mt-3 max-w-2xl">As peças favoritas da comunidade Benê. Qual combina mais com seu ritmo?</Text>
        </Container>
      </section>

      <Container className="pb-20">
        <ProductsGrid limit={6} />
      </Container>
    </main>
  );
}
