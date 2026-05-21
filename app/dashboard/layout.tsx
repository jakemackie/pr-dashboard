import { authOptions } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <DashboardShell displayName={displayName} avatarUrl={avatarUrl} initials={initials}>
      {children}
    </DashboardShell>
  );
}
