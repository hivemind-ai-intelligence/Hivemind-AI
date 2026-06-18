export default function WorldMap() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            🌍 Global Digital Presence
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            From One Vision To A Worldwide Network
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card/50 backdrop-blur-xl p-8">

          <div className="h-[400px] flex flex-col items-center justify-center">
            <span className="text-8xl mb-6">🌍</span>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
                🇮🇳 India Active
              </div>

              <div className="px-4 py-2 rounded-full border border-white/10">
                🇺🇸 USA
              </div>

              <div className="px-4 py-2 rounded-full border border-white/10">
                🇬🇧 UK
              </div>

              <div className="px-4 py-2 rounded-full border border-white/10">
                🇨🇦 Canada
              </div>

              <div className="px-4 py-2 rounded-full border border-white/10">
                🇦🇺 Australia
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">

            <div className="rounded-2xl border border-white/10 p-5 text-center">
              <h3 className="text-3xl font-bold">10+</h3>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>

            <div className="rounded-2xl border border-white/10 p-5 text-center">
              <h3 className="text-3xl font-bold">50+</h3>
              <p className="text-sm text-muted-foreground">Clients</p>
            </div>

            <div className="rounded-2xl border border-white/10 p-5 text-center">
              <h3 className="text-3xl font-bold">24/7</h3>
              <p className="text-sm text-muted-foreground">AI Support</p>
            </div>

            <div className="rounded-2xl border border-white/10 p-5 text-center">
              <h3 className="text-3xl font-bold">100+</h3>
              <p className="text-sm text-muted-foreground">Languages</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}