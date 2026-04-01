import { SignIn } from "@clerk/nextjs";
import { AuthBackground } from "@/components/AuthBackground";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <AuthBackground />
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
}
