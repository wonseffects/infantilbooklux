import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "InfantilBooksLux - Histórias Mágicas",
    description: "A melhor plataforma de ebooks infantis com design premium.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
