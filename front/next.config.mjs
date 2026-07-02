/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export estático para GitHub Pages (NEXT_OUTPUT=export en el workflow).
  // En local se omite para poder usar `next dev` / `next start` normalmente.
  ...(process.env.NEXT_OUTPUT === "export" ? { output: "export" } : {}),
  // GitHub Pages sirve el sitio bajo /<repo> (ej. /clothea)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;
