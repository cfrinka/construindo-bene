import Container from "@/components/ui/Container";
import { H1, Text } from "@/components/ui/Typography";
import CollectionsGrid from "@/components/data/CollectionsGrid";

export default function ColecoesPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-forest/10 to-brand-accent/10" />
        <Container className="relative py-20">
          <H1>Coleções em Destaque</H1>
          <Text className="mt-3 max-w-2xl">Explore cápsulas criativas que misturam ritmo, cor e liberdade. Cada coleção traz um recorte do Brasil em peças exclusivas.</Text>
        </Container>
      </section>

      <Container className="pb-20">
        <CollectionsGrid limit={6} />
      </Container>
    </main>
  );
}
