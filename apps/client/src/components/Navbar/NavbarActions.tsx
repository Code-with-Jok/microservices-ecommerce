"use client";

import Link from "next/link";
import { Home, Bell } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import SearchBar from "../SearchBar";
import ProfileButton from "../ProfileButton";
import { motion } from "framer-motion";
import { Suspense } from "react";

export const NavbarActions = () => {
  return (
    <div className="flex items-center gap-4 md:gap-6">
      <Suspense
        fallback={
          <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
        }
      >
        <SearchBar />
      </Suspense>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Link
          href="/"
          className="p-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all block"
        >
          <Home className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
        </Link>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <button className="p-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer relative group">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>
      </motion.div>

      <div className="h-6 w-px bg-border/50 mx-2 hidden md:block" />

      <SignedOut>
        <SignInButton mode="modal">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
          >
            Sign In
          </motion.button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <ProfileButton />
      </SignedIn>
    </div>
  );
};
