import Container from "@/components/ui/Container";
import CreatorsGrid from "@/components/data/CreatorsGrid";
import PageHeader from "@/components/content/PageHeader";
import PageBody from "@/components/content/PageBody";

export default function CriadoresPage() {
  return (
    <main className="min-h-screen">
      <PageHeader page="criadores" />
      <Container className="py-6">
        <PageBody page="criadores" />
      </Container>

      <Container className="pb-20">
        <h2 className="text-2xl font-semibold mb-6">Conheça os criadores</h2>
        <CreatorsGrid limit={6} />
      </Container>
    </main>
  );
}
