import Link from 'next/link';
import { useRouter } from 'next/router';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useClerk } from '@clerk/nextjs';
import Hero from '@/components/ui/animated-shader-hero';

export default function Home() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const handlePrimaryClick = () => {
    if (isSignedIn) {
      router.push('/product');
    } else {
      openSignIn();
    }
  };

  return (
    <>
      {/* Floating navigation — sits above the full-screen Hero */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4">
        <span className="text-white font-bold text-xl drop-shadow">TriviaGen</span>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-300/30 hover:border-orange-300/50 text-orange-100 font-medium py-2 px-5 rounded-full transition-all backdrop-blur-sm text-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link
                href="/product"
                className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-300/30 text-orange-100 font-medium py-2 px-5 rounded-full transition-all backdrop-blur-sm text-sm"
              >
                Go to App
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </nav>

      <Hero
        trustBadge={{ text: "AI-Powered Canadian History", icons: ["✨"] }}
        headline={{
          line1: "Generate Your Next",
          line2: "Canadian Trivia Idea",
        }}
        subtitle="Harness the power of AI to discover innovative historical trivia tailored for today"
        buttons={{
          primary: {
            text: isSignedIn ? "Generate Trivia Now" : "Get Started Free",
            onClick: handlePrimaryClick,
          },
        }}
      />
    </>
  );
}
