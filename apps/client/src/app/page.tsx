"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight, ShoppingBag, Sparkles, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-emerald-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary/20 glass transition-all">
                New Collection is here.{" "}
                <Link href="/" className="font-bold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            >
              Experience the Future of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                Ecommerce
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg leading-8 text-muted-foreground"
            >
              Shop the latest trends with our high-performance, secure, and
              intuitive platform. Built with modern tech for the ultimate
              shopping experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button
                size="lg"
                className="rounded-full px-8 shadow-xl shadow-primary/20 group"
              >
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full px-8">
                Learn more
              </Button>
            </motion.div>
          </div>

          {/* Feature Grid Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 flow-root sm:mt-24"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                {
                  title: "Fast Delivery",
                  desc: "Get your items in record time with our global logistics.",
                  icon: ShoppingBag,
                },
                {
                  title: "Quality Gear",
                  desc: "Curated selection of high-quality products from top brands.",
                  icon: Star,
                },
                {
                  title: "Best Support",
                  desc: "Dedicated team ready to help you 24/7 with any issues.",
                  icon: Sparkles,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
