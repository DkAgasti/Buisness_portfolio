import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl sm:text-9xl font-bold gradient-text font-heading mb-4">404</h1>
        <p className="text-muted-foreground text-xl mb-2">Oops! Page not found</p>
        <p className="text-muted-foreground text-sm mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn-primary inline-flex px-6 py-3">
          Go Home
        </Link>
      </div>
    </main>
  );
}
