import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atualização de Valores pela SELIC",
  description:
    "Calcule e atualize os valores dos processos com base nos índices oficiais do Banco Central.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
