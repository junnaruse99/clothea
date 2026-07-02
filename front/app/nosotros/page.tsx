export const metadata = {
  title: "Nosotros · Clothea",
};

export default function NosotrosPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-blush via-cream to-lilac-soft">
        <div className="animate-blob absolute -left-20 -top-20 h-72 w-72 rounded-full bg-rose/15 blur-3xl" />
        <div className="animate-blob-slow absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <span className="animate-twinkle absolute right-[15%] top-12 text-xl text-rose/60 select-none">✦</span>
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
            Nuestra historia
          </p>
          <h1
            className="animate-fade-up mt-3 font-display text-4xl font-bold sm:text-5xl"
            style={{ animationDelay: "0.15s" }}
          >
            Moda para todas,{" "}
            <em className="text-gradient">sin romper tu bolsillo</em>
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-lg leading-relaxed text-ink-soft sm:px-6">
        <p>
          En <strong className="text-ink">Clothea</strong> creemos que verse y
          sentirse bien no debería costar una fortuna. Nacimos en Lima con una
          idea simple: ofrecer{" "}
          <strong className="text-ink">ropa femenina asequible</strong>, bonita
          y de calidad, pensada para la mujer peruana real — la que estudia,
          trabaja, emprende y vive la ciudad todos los días.
        </p>
        <p>
          Seleccionamos cada prenda con cariño: telas frescas para el clima
          limeño, cortes que favorecen todas las siluetas y precios honestos.
          Desde el vestido para esa ocasión especial hasta el polo básico de
          algodón pima para el día a día.
        </p>
        <p>
          Hacemos delivery a todos los distritos de Lima, para que tu próximo
          outfit favorito llegue hasta la puerta de tu casa.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 px-4 pb-16 sm:grid-cols-3 sm:px-6">
        {[
          {
            icon: "✿",
            title: "Precios justos",
            text: "Moda linda y accesible, sin intermediarios de más.",
          },
          {
            icon: "♥",
            title: "Hecho con amor",
            text: "Cada colección se elige pensando en ti y en Lima.",
          },
          {
            icon: "✦",
            title: "Delivery en Lima",
            text: "Llegamos a todos los distritos de la ciudad.",
          },
        ].map((item, i) => (
          <div
            key={item.title}
            className="animate-fade-up rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-sand transition hover:-translate-y-1 hover:shadow-lg hover:shadow-rose/10"
            style={{ animationDelay: `${0.2 + i * 0.15}s` }}
          >
            <span className="text-2xl text-rose">{item.icon}</span>
            <h3 className="mt-2 font-display text-lg font-semibold text-rose-dark">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
