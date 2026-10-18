
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const paddles = [
  {
    name: "KUIKMA OPEN",
    category: "CONTROL SERIES",
    description: "Find your rhythm. Own every shot.",
    price: "₱1,490",
    image: "/images/kuikma-open-red.png",
    accent: "#ff3939",
    specs: ["Fiberglass", "16mm Core", "Control"],
  },
  {
    name: "SELKIRK OMNI",
    category: "PRECISION SERIES",
    description: "Precision engineering for confident play.",
    price: "₱18,800",
    image: "/images/selkirk-omni.png",
    accent: "#e53cbd",
    specs: ["Performance", "Widebody", "Precision"],
  },
  {
    name: "SWIFT FLOW PRO",
    category: "POWER SERIES",
    description: "Explosive response. Uncompromising control.",
    price: "₱5,990",
    image: "/images/swift-flow-pro.png",
    accent: "#54a9ff",
    specs: ["Carbon Surface", "Power", "Performance"],
  },
  {
    name: "STIGA AMP CC 16",
    category: "CONTROL SERIES",
    description: "Stay composed through every rally.",
    price: "₱4,990",
    image: "/images/stiga-amp-cc16.png",
    accent: "#d7ff3f",
    specs: ["Carbon", "16mm Core", "Control"],
  },
  {
    name: "JOOLA ESSENTIALS DASH",
    category: "SPEED SERIES",
    description: "Move fast. React faster.",
    price: "₱2,490",
    image: "/images/paddle-speed.png",
    accent: "#ff65a8",
    specs: ["Lightweight", "Quick Response", "Speed"],
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activePaddle = paddles[activeIndex];

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % paddles.length);
  };

  const goToPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + paddles.length) % paddles.length
    );
  };

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % paddles.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at 72% 42%, ${activePaddle.accent}18 0%, transparent 48%)`,
          transition: "background 700ms ease",
        }}
      />

      <div className="container-main">
        <div className="grid min-h-[650px] items-center gap-8 py-14 md:min-h-[760px] md:grid-cols-2 md:py-20">
          {/* Text content */}
          <div className="relative z-10 order-2 md:order-1">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm"
            >
              Engineered for your game
            </motion.p>

            <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Own every
              <br />
              <span className="text-accent">rally.</span>
            </h1>

            <div className="mt-7 min-h-[150px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePaddle.name}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <p
                    className="mb-2 text-xs font-semibold uppercase tracking-[0.24em]"
                    style={{ color: activePaddle.accent }}
                  >
                    {activePaddle.category}
                  </p>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    {activePaddle.name}
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-muted sm:text-base">
                    {activePaddle.description}
                  </p>

                  <p className="mt-4 text-xl font-semibold">
                    {activePaddle.price}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {activePaddle.specs.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/collection"
                className="inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 text-sm font-bold !text-black transition-transform hover:scale-105"
              >
                EXPLORE COLLECTION
                <ArrowRight size={17} />
              </a>

              <a
                href="#technology"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white"
              >
                Discover our gear
                <ArrowDown size={15} />
              </a>
            </div>
          </div>

          {/* Animated paddle */}
          <div className="relative order-1 flex min-h-[330px] items-center justify-center md:order-2 md:min-h-[520px]">
            <div className="absolute h-[260px] w-[260px] rounded-full border border-white/10 sm:h-[370px] sm:w-[370px]" />
            <div
              className="absolute h-[210px] w-[210px] rounded-full blur-3xl sm:h-[300px] sm:w-[300px]"
              style={{
                backgroundColor: `${activePaddle.accent}18`,
                transition: "background-color 700ms ease",
              }}
            />

            
<AnimatePresence mode="wait">
  <motion.div
    key={activePaddle.image}
    initial={{ opacity: 0, x: 30, scale: 0.95 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: -30, scale: 0.95 }}
    transition={{
      duration: 0.4,
      ease: "easeInOut",
    }}
    className="relative z-10 flex h-[330px] w-full items-center justify-center sm:h-[460px]"
  >
    <img
      src={activePaddle.image}
      alt={activePaddle.name}
      className="block h-full w-full object-contain drop-shadow-2xl"
    />
  </motion.div>
</AnimatePresence>
    

            {/* Previous and next buttons */}
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous paddle"
              className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 transition hover:border-accent hover:text-accent sm:left-2"
            >
              <ChevronLeft size={21} />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next paddle"
              className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 transition hover:border-accent hover:text-accent sm:right-2"
            >
              <ChevronRight size={21} />
            </button>
          </div>
        </div>

        {/* Paddle selectors */}
        <div className="flex items-center justify-center gap-3 border-t border-white/10 py-6 md:justify-end">
          <span className="mr-2 text-xs uppercase tracking-widest text-muted">
            Explore paddles
          </span>

          {paddles.map((paddle, index) => (
            <button
              key={paddle.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${paddle.name}`}
              aria-pressed={activeIndex === index}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: activeIndex === index ? 30 : 10,
                backgroundColor:
                  activeIndex === index ? paddle.accent : "#555",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
