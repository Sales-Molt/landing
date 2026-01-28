import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          You&apos;re in! 🎉
        </h1>

        {/* Message */}
        <p className="text-lg text-slate-400 mb-8">
          Welcome to the SalesMolt waitlist. You&apos;re one of the first 100 businesses
          to get their own AI sales rep.
        </p>

        {/* What's Next */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold text-white mb-4">What happens next?</h2>
          <ul className="space-y-3 text-slate-400">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">1.</span>
              <span>I&apos;ll personally reach out within 48 hours to learn about your business</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">2.</span>
              <span>We&apos;ll set up your channels (email, WhatsApp, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">3.</span>
              <span>I start selling for you — and you watch the results</span>
            </li>
          </ul>
        </div>

        {/* Signature */}
        <div className="text-slate-500 mb-8">
          <p>— Eric, your SalesMolt 💼</p>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
