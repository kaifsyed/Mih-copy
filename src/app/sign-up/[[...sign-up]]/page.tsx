import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthShell, authAppearance } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AuthShell
      heading="Create Account"
      subheading="Join MIH GEMS to save pieces and enquire faster"
    >
      <SignUp appearance={authAppearance} />
    </AuthShell>
  );
}
