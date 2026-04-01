"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export const Brand = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <motion.div
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.95 }}
        className="p-1.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors"
      >
        <Image
          src="/vercel.svg"
          alt="JOK"
          width={28}
          height={28}
          className="opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </motion.div>
      <p className="hidden md:block text-lg font-bold tracking-tight text-foreground">
        JOK
      </p>
    </Link>
  );
};
