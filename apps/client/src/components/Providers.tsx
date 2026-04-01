import { ClerkProvider } from "@clerk/nextjs";

type ProvidersProps = {
  children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          shimmer: true,
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton",
        },
        variables: {
          colorPrimary: "oklch(0.64 0.17 150)",
          colorBackground: "oklch(1 0 0)",
          colorText: "oklch(0.15 0.02 240)",
          colorInputBackground: "oklch(0.99 0.005 240)",
          colorInputText: "oklch(0.15 0.02 240)",
          borderRadius: "0.75rem",
        },
        elements: {
          card: "glass border-white/10 shadow-glass",
          navbar: "hidden",
          footer: "hidden",
          headerTitle: "text-2xl font-bold tracking-tight text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton:
            "glass border-white/5 hover:bg-primary/5 transition-all duration-200",
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]",
          formFieldInput:
            "glass focus:ring-2 focus:ring-primary/20 transition-all",
          dividerLine: "bg-border/50",
          dividerText: "text-muted-foreground leading-relaxed",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};
