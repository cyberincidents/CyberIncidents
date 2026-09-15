import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AccountProfile from "@/components/account/AccountProfile";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white transition-colors duration-200 dark:bg-[#05070a] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#0284c7] dark:text-[#38bdf8]">
            My Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
            Manage your CyberIncidents profile information.
          </p>
        </div>

        <AccountProfile />
      </div>
    </main>
  );
}