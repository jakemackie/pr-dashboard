import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <Button asChild size="lg">
        <Link href="/dashboard">Log in</Link>
      </Button>
    </main>
  );
}
