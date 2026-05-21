import { Suspense } from "react";
import { LoginScreen } from "./login-screen";

export const metadata = {
  title: "Sign in — mdshare",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <LoginScreen />
    </Suspense>
  );
}
