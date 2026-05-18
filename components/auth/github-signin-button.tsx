"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function GitHubSignInButton() {
  return (
    <Button
      size="lg"
      type="button"
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
    >
      Log in with GitHub
    </Button>
  );
}
