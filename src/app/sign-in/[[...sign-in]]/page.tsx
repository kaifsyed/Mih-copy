import { SignIn } from "@clerk/nextjs";
import { AuthShell, authAppearance } from "@/components/auth/auth-shell";

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
