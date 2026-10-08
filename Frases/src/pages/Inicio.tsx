import SwipeCards from "@/components/ui/image-stack-carousel";

export default function Inicio() {
  return (
    <main className="h-dvh overflow-hidden bg-slate-950 px-6 py-6 text-white sm:py-10">
      <section className="mx-auto flex h-full min-h-0 max-w-5xl flex-col items-center text-center">
        <div className="relative z-20 shrink-0 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 sm:text-6xl">
Random
</h1>

        </div>
        <div className="relative z-0 flex min-h-0 w-full flex-1 items-start justify-center pt-6 sm:pt-8">
          <SwipeCards />
        </div>
        
      </section>
    </main>
  );
}
