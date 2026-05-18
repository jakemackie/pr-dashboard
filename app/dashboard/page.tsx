import { authOptions } from "@/auth";
import { SalesChart } from "@/components/dashboard/sales-chart";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const sidebarLinks = [
  "Overview",
  "Projects",
  "Analytics",
  "Messages",
  "Settings",
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const displayName = session.user.name ?? "GitHub User";
  const avatarUrl = session.user.image ?? "";
  const initials = displayName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen w-full border-x border-zinc-800/70">
        <aside className="flex w-72 flex-col border-r border-zinc-800/70 bg-zinc-900/90 px-5 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Mock App</p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Dashboard</h1>
          </div>

          <nav className="mt-10 flex flex-1 flex-col gap-2">
            {sidebarLinks.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  index === 0
                    ? "bg-zinc-800 text-zinc-50"
                    : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${displayName} avatar`}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-zinc-100">{displayName}</p>
                <p className="text-xs text-zinc-400">GitHub Account</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 px-6 py-6 sm:px-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-zinc-50">Revenue Snapshot</h2>
              <p className="text-sm text-zinc-400">
                Mock weekly activity for a sample team workspace.
              </p>
            </div>
            <div className="h-[360px]">
              <SalesChart />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
