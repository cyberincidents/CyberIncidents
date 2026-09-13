import LoginForm from "@/components/auth/LoginForm";

type SearchParams = {
  registered?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const registered = params.registered === "true";

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto flex max-w-md flex-col justify-center">
        <div className="text-center">
          <a href="/" className="inline-block">
            <img
              src="/brand/cyberincidents-logo.png"
              alt="CyberIncidents"
              className="mx-auto h-12 w-auto object-contain"
            />
          </a>

          <h1 className="mt-8 text-3xl font-bold text-slate-950">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your CyberIncidents account.
          </p>
        </div>

        <LoginForm registered={registered} />
      </div>
    </main>
  );
}