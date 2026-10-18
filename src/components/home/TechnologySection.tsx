"use client";

import { motion, useReducedMotion } from "motion/react";
import { Crosshair, Layers3, Zap } from "lucide-react";

const technologies = [
  {
    number: "01",
    title: "Precision Control",
    description:
      "Designed to help players place shots with confidence and maintain control during fast rallies.",
    icon: Crosshair,
    detail: "TOUCH & ACCURACY",
  },
  {
    number: "02",
    title: "Layered Construction",
    description:
      "Explore paddle constructions and core designs selected for different playing styles.",
    icon: Layers3,
    detail: "MATERIAL & FEEL",
  },
  {
    number: "03",
    title: "Explosive Response",
    description:
      "Find a paddle that suits your pace, whether you're attacking the ball or reacting at the net.",
    icon: Zap,
    detail: "SPEED & POWER",
  },
];

export default function TechnologySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="technology" className="container-main py-24 sm:py-32">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-accent">
          BUILT AROUND YOUR GAME
        </p>

        <h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">
          Every detail.
          <br />
          <span className="text-muted">A reason to play.</span>
        </h2>

        <p className="text-muted mt-5 max-w-xl leading-7">
          Every player has a different style. Explore the materials, feel, and
          performance characteristics that help you find your ideal paddle.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {technologies.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.number}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: reduceMotion ? 0 : index * 0.1,
              }}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-widest text-muted">
                  / {item.number}
                </span>

                <Icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-accent transition-transform group-hover:scale-110"
                />
              </div>

              <p className="mt-10 text-[10px] font-semibold tracking-[0.2em] text-accent">
                {item.detail}
              </p>

              <h3 className="mt-3 font-display text-2xl font-semibold">
                {item.title}
              </h3>

              <p className="text-muted mt-4 text-sm leading-7">
                {item.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
