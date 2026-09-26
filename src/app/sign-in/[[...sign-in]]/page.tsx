import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthShell, authAppearance } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <AuthShell
      heading="Welcome Back"
      subheading="Sign in to your MIH GEMS account"
    >
      <SignIn appearance={authAppearance} />
    </AuthShell>
  );
}
