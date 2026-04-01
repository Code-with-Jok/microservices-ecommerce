import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="mt-16 flex flex-col gap-12 glass p-10 rounded-3xl border border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Image
                src="/vercel.svg"
                alt="JOK"
                width={32}
                height={32}
                className="opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground transition-all">
              JOK<span className="text-primary">.</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Premium ecommerce experience powered by modern microservices
            architecture. Dedicated to quality and speed.
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">
              © 2026 JOK.
            </p>
            <p className="text-xs text-muted-foreground">
              All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
            Shop
          </h4>
          <nav className="flex flex-col gap-3 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Best Sellers
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Sale
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
            Company
          </h4>
          <nav className="flex flex-col gap-3 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Affiliate
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
            Legal
          </h4>
          <nav className="flex flex-col gap-3 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Shipping Info
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Returns
            </Link>
          </nav>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          Built with <span className="text-destructive">♥</span> using Next.js &
          Tailwind 4
        </p>
        <div className="flex gap-6">
          <div className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
