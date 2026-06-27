import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: {
    index: false,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-foreground text-3xl font-bold">Privacy Policy</h1>

        <section>
          <h2 className="text-foreground mb-3 text-xl font-semibold">
            Introduction
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            This policy describes how Mandor Plate handles account data when you
            use the application. Replace this page with your organisation&apos;s
            policy before production deployment.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-xl font-semibold">
            Authentication
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Sign-in is handled by the Mandor Plate API. The web app stores
            access and refresh tokens in httpOnly cookies via the BFF layer.
            Tokens are not exposed to client-side JavaScript.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-xl font-semibold">
            Data we process
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Account data typically includes email, name, role, and optional
            profile photo metadata. Product and usage data depend on features
            you enable in your deployment.
          </p>
        </section>

        <section>
          <h2 className="text-foreground mb-3 text-xl font-semibold">
            Contact
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            For privacy questions, contact the operator of this deployment.
          </p>
        </section>

        <div className="border-border border-t pt-4">
          <p className="text-muted-foreground text-sm">
            Template — update before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
