import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/CartContext";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanae Atelier · Moda femenina asequible en Lima",
  description:
    "Ropa femenina linda y asequible con delivery en todos los distritos de Lima, Perú.",
};

// El sitio trae tema claro y oscuro propios (tokens en globals.css);
// declararlo evita además el oscurecimiento forzado del navegador
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf9f8" },
    { media: "(prefers-color-scheme: dark)", color: "#211721" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Karla:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
