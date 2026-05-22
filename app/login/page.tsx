import { Suspense } from "react";
import { LoginScreen } from "./login-screen";

export const metadata = {
  title: "Sign in",
  description:
    "Sign in with Google to publish your markdown and keep a library of your posts.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <LoginScreen />
    </Suspense>
  );
}
