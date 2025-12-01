import Container from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/content/PageHeader";
import PageBody from "@/components/content/PageBody";

export default function SobrePage() {
  return (
    <main className="min-h-screen">
      <PageHeader page="sobre" />
      <Container className="max-w-4xl py-10">
        <PageBody page="sobre" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            { t: "Manifesto", d: "Vestir é expressão. Cada estampa é um grito de identidade, cada cor carrega uma energia. Não seguimos tendências: criamos movimentos." },
            { t: "Sustentabilidade", d: "Parcerias locais, materiais responsáveis e produção consciente. Cuidamos do que vestimos e de quem faz." },
            { t: "Qualidade", d: "Tecidos premium, caimento confortável e acabamento de alto padrão para durar muitas histórias." },
            { t: "Comunidade", d: "Colaborações com artistas independentes e ações culturais. Benê é para todo mundo." },
          ].map((b) => (
            <Card key={b.t} className="p-6">
              <CardBody className="p-0">
                <h3 className="text-lg font-display font-semibold">{b.t}</h3>
                <p className="mt-2 text-sm text-neutral-600">{b.d}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-gradient-to-r from-brand-primary via-brand-forest to-brand-accent p-[1px]">
          <div className="rounded-xl bg-white p-6">
            <h3 className="text-lg font-display font-semibold">Junte-se ao movimento</h3>
            <p className="mt-2 text-sm text-neutral-700">Assine a newsletter para receber lançamentos e convites para eventos.</p>
            <form className="mt-4 flex gap-2">
              <input className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-500" placeholder="Seu e-mail" />
              <Button variant="danger">Assinar</Button>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
}
