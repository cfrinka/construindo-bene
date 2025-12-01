import Container from "@/components/ui/Container";
import { H1, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ContatoPage() {
  return (
    <main className="min-h-screen">
      <Container className="max-w-4xl py-20">
        <H1>Fale com a gente</H1>
        <Text className="mt-3">Dúvidas, parcerias ou imprensa? Manda um alô — respondemos rapidinho.</Text>

        <form className="mt-8 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-md border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-500" placeholder="Seu nome" />
            <input type="email" className="rounded-md border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-500" placeholder="Seu e-mail" />
          </div>
          <input className="rounded-md border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-500" placeholder="Assunto" />
          <textarea rows={6} className="rounded-md border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-500" placeholder="Mensagem" />
          <div className="flex items-center gap-3">
            <Button>Enviar</Button>
            <span className="text-xs text-neutral-500">Ao enviar, você aceita nossa política de privacidade.</span>
          </div>
        </form>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card className="p-5">
            <h3 className="font-display font-semibold">Atendimento</h3>
            <p className="mt-1 text-sm text-neutral-600">seg–sex, 9h às 18h</p>
          </Card>
          <Card className="p-5">
            <h3 className="font-display font-semibold">E-mail</h3>
            <p className="mt-1 text-sm text-neutral-600">contato@benebrasil.com</p>
          </Card>
          <Card className="p-5">
            <h3 className="font-display font-semibold">Redes</h3>
            <p className="mt-1 text-sm text-neutral-600">@benebrasiloficial</p>
          </Card>
        </div>
      </Container>
    </main>
  );
}
