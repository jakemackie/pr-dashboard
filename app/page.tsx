import { authOptions } from "@/auth";
import { GitHubSignInButton } from "@/components/auth/github-signin-button";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <GitHubSignInButton />
    </main>
  );
}
