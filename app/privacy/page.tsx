import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CyberIncidents",
  description:
    "Learn how CyberIncidents collects, uses, protects, and manages personal information when you use our website and services.",
  alternates: {
    canonical: "https://cyberincidents.in/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-[#05070a] dark:text-slate-100">
      {/* Header */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#070b11]">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
          <Link
            href="/"
            className="text-sm font-semibold text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400"
          >
            ← Back to CyberIncidents
          </Link>

          <div className="mt-10">
            <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
              Legal
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
              Your privacy matters to us. This Privacy Policy explains how
              CyberIncidents collects, uses, stores, and protects information
              when you visit or use our website and services.
            </p>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
              Last updated: September 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="space-y-12">
          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold">
              1. About This Privacy Policy
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              This Privacy Policy applies to CyberIncidents and the website
              available at{" "}
              <a
                href="https://cyberincidents.in"
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-400"
              >
                cyberincidents.in
              </a>
              , including related pages, features, and services that link to
              this Privacy Policy.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              By using CyberIncidents, you acknowledge that you have read and
              understood this Privacy Policy. If you do not agree with it,
              please discontinue use of the website.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold">
              2. Information We Collect
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Depending on how you use CyberIncidents, we may collect the
              following categories of information.
            </p>

            <h3 className="mt-6 text-lg font-semibold">
              Information you provide
            </h3>

            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>Name or display name</li>
              <li>Email address</li>
              <li>Account credentials and authentication information</li>
              <li>Profile information you choose to provide</li>
              <li>Information contained in messages or submissions you send us</li>
              <li>Other information you voluntarily provide through the website</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold">
              Information collected automatically
            </h3>

            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>IP address</li>
              <li>Browser and device information</li>
              <li>Operating system information</li>
              <li>Pages visited and interactions with the website</li>
              <li>Approximate usage and session information</li>
              <li>Referring URLs and similar technical information</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold">
              3. How We Use Information
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We may use collected information to:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>Create and maintain user accounts</li>
              <li>Authenticate users and maintain account security</li>
              <li>Provide and operate CyberIncidents services</li>
              <li>Send account-related communications</li>
              <li>Process password-reset requests</li>
              <li>Respond to questions, requests, or support inquiries</li>
              <li>Understand how users interact with the website</li>
              <li>Improve website performance, functionality, and usability</li>
              <li>Detect, investigate, and prevent abuse or security incidents</li>
              <li>Maintain the security and integrity of our systems</li>
              <li>Comply with applicable legal obligations</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold">
              4. Account Information and Passwords
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              If you create an account, you are responsible for keeping your
              login credentials confidential and for activity performed through
              your account.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Passwords are intended to be stored using appropriate
              security measures rather than as readable plain-text passwords.
              Password-reset links may contain temporary security tokens that
              expire after a limited period.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You should contact us promptly if you believe your account or
              credentials have been compromised.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold">
              5. Cookies and Similar Technologies
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              CyberIncidents may use cookies, local storage, session
              technologies, or similar mechanisms to provide essential
              functionality, maintain authentication sessions, remember
              preferences, and understand website usage.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Some technologies may be provided by third-party services used
              by the website. Your browser may provide controls for managing
              cookies and similar technologies, although disabling certain
              technologies may affect website functionality.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold">
              6. Analytics and Website Usage
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We may use analytics and similar technologies to understand
              traffic, usage patterns, and website performance. These tools may
              collect technical information such as browser type, device
              information, pages viewed, approximate location derived from
              network information, and interaction data.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Where third-party analytics services are used, their own privacy
              policies may also apply.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-bold">
              7. Service Providers and Third Parties
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We may use trusted third-party providers to operate parts of
              CyberIncidents. These providers may process information on our
              behalf for purposes such as hosting, databases, email delivery,
              authentication, analytics, security, or other technical
              operations.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We do not authorize service providers to use personal information
              processed on our behalf for purposes unrelated to the services
              they provide to us, subject to their applicable terms and legal
              obligations.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-bold">
              8. Data Sharing
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We do not sell your personal information as part of the ordinary
              operation of CyberIncidents.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Information may be disclosed when reasonably necessary to:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>Provide requested services</li>
              <li>Work with service providers operating the platform</li>
              <li>Protect the security and rights of CyberIncidents or others</li>
              <li>Investigate suspected fraud, abuse, or security incidents</li>
              <li>Comply with applicable laws or valid legal requests</li>
              <li>Protect against serious threats to safety or security</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-bold">
              9. International Data Transfers
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              CyberIncidents and its service providers may operate
              infrastructure in different countries. As a result, your
              information may be processed or stored outside the country in
              which you live.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Where required by applicable law, we will take appropriate
              measures for international transfers and protection of personal
              information.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-bold">
              10. Data Security
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We use reasonable technical and organizational measures designed
              to protect information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              However, no website, internet transmission, or storage system can
              be guaranteed to be completely secure. You should use strong,
              unique passwords and avoid sharing account credentials with
              others.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-bold">
              11. Data Retention
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We retain personal information for as long as reasonably
              necessary for the purposes described in this Privacy Policy,
              including providing services, maintaining records, resolving
              disputes, enforcing agreements, preventing abuse, and complying
              with legal obligations.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Retention periods may vary depending on the type of information
              and the reason it was collected.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-bold">
              12. Your Privacy Rights
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Depending on where you live and the laws applicable to you, you
              may have rights relating to your personal information. These may
              include rights to:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>Request access to personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of certain information</li>
              <li>Request restriction of certain processing</li>
              <li>Object to certain processing activities</li>
              <li>Request portability of certain information</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              These rights are not absolute and may be subject to limitations
              or exceptions under applicable law.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-2xl font-bold">
              13. Account Deletion and Requests
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              If you want to request access, correction, deletion, or other
              privacy-related action concerning your information, contact us
              using the contact information provided below.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We may need to verify your identity before completing certain
              requests in order to protect your account and personal
              information.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-2xl font-bold">
              14. Children's Privacy
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              CyberIncidents is not intended to knowingly collect personal
              information from children in circumstances where such collection
              is prohibited by applicable law.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              If you believe that a child has provided personal information to
              us in violation of applicable requirements, please contact us so
              that we can review and take appropriate action.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-2xl font-bold">
              15. External Links
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              CyberIncidents may contain links to websites, services, or
              resources operated by third parties. We are not responsible for
              the privacy practices or content of external websites.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We recommend reviewing the privacy policy of any external service
              before providing it with personal information.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-2xl font-bold">
              16. Changes to This Privacy Policy
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We may update this Privacy Policy from time to time to reflect
              changes to our services, technology, legal requirements, or
              privacy practices.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              When changes are made, we will update the “Last updated” date at
              the beginning of this policy. Your continued use of CyberIncidents
              after an updated policy becomes effective constitutes use subject
              to the updated policy, to the extent permitted by applicable law.
            </p>
          </section>

          
{/* 17 */}
<section>
  <h2 className="text-2xl font-bold">
    17. Contact Us
  </h2>

  <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
    If you have questions, concerns, or requests regarding this
    Privacy Policy or the way CyberIncidents handles personal
    information, please contact us using the details below.
  </p>

  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
    <p className="font-semibold">CyberIncidents</p>

    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
      Website:{" "}
      <a
        href="https://cyberincidents.in"
        className="text-cyan-600 hover:underline dark:text-cyan-400"
      >
        cyberincidents.in
      </a>
    </p>

    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
      Email:{" "}
      <a
        href="mailto:cyberincidents07@gmail.com"
        className="text-cyan-600 hover:underline dark:text-cyan-400"
      >
        cyberincidents07@gmail.com
      </a>
    </p>

    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
      For privacy-related requests, account-related concerns, or
      questions about this Privacy Policy, you can contact us at
      the email address above.
    </p>
  </div>
</section>



          {/* Final note */}
          <section className="border-t border-slate-200 pt-8 dark:border-white/10">
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-500">
              This Privacy Policy is intended to describe CyberIncidents'
              general privacy practices. It is not a substitute for legal
              advice and may need to be supplemented or modified based on the
              specific services, jurisdictions, and legal requirements
              applicable to CyberIncidents.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

