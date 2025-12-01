import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Header from "../components/Header";
import NavLink from "../components/ui/NavLink";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-ui" });

const naughtyMonster = localFont({
  src: [
    {
      path: "../../public/fonts/naughty-monster/NaughtyMonster.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Benê Brasil — Moda feita de ritmo, cor e liberdade",
  description: "Descubra a Benê Brasil: uma marca que celebra o estilo brasileiro com cores vibrantes, ritmo e liberdade em cada peça.",
  keywords: ["moda brasileira", "streetwear", "camisetas", "arte urbana", "moda sustentável", "criadores brasileiros", "estilo brasileiro"],
  authors: [{ name: "Benê Brasil" }],
  openGraph: {
    title: "Benê Brasil — Moda feita de ritmo, cor e liberdade",
    description: "Descubra a Benê Brasil: uma marca que celebra o estilo brasileiro com cores vibrantes, ritmo e liberdade em cada peça.",
    type: "website",
    locale: "pt_BR",
    siteName: "Benê Brasil",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benê Brasil — Moda feita de ritmo, cor e liberdade",
    description: "Descubra a Benê Brasil: uma marca que celebra o estilo brasileiro com cores vibrantes, ritmo e liberdade em cada peça.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className={`${montserrat.variable} ${naughtyMonster.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Header />
              <main>{children}</main>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>

        <footer className="mt-20 bg-[#1f1f1f] text-white border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="font-display font-semibold">Benê Brasil</h4>
              <p className="mt-2 text-sm text-white/70">Moda feita de ritmo, cor e liberdade.</p>
            </div>
            <div>
              <h5 className="text-sm font-display font-semibold text-white/80">Explorar</h5>
              <ul className="mt-2 space-y-1 text-sm text-white/70">
                <li><NavLink className="hover:text-white" href="/colecoes">Coleções</NavLink></li>
                <li><NavLink className="hover:text-white" href="/produtos">Produtos</NavLink></li>
                <li><NavLink className="hover:text-white" href="/criadores">Criadores</NavLink></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-display font-semibold text-white/80">Institucional</h5>
              <ul className="mt-2 space-y-1 text-sm text-white/70">
                <li><NavLink className="hover:text-white" href="/sobre">Sobre</NavLink></li>
                <li><NavLink className="hover:text-white" href="/contato">Contato</NavLink></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-display font-semibold text-white/80">Novidades</h5>
              <form className="mt-2 flex gap-2">
                <input className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 outline-none placeholder:text-white/50" placeholder="Seu e-mail" />
                <button className="px-4 py-2 rounded-md bg-brand-primary hover:opacity-90">Assinar</button>
              </form>
            </div>
          </div>
          <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
            © {new Date().getFullYear()} Benê Brasil. Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
