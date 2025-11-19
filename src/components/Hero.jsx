import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="backdrop-blur-sm bg-black/30 rounded-2xl p-6 md:p-8 border border-white/10">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">PulsePoint</h1>
            <p className="mt-3 md:mt-4 text-blue-100 text-sm md:text-base max-w-2xl">
              Your personal medical companion. Track vitals, manage medications, access history, and get help fast — all in one secure place.
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
    </section>
  );
}
