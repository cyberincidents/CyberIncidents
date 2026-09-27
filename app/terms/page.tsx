import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | CyberIncidents",
  description:
    "Read the Terms and Conditions governing the use of CyberIncidents and its website and services.",
  alternates: {
    canonical: "https://cyberincidents.in/terms",
  },
};

export default function TermsPage() {
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
              Terms & Conditions
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
              These Terms and Conditions govern your access to and use of
              CyberIncidents, including the website, content, accounts, and
              related services.
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
              1. Acceptance of These Terms
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              By accessing or using CyberIncidents, you agree to be bound by
              these Terms and Conditions and our Privacy Policy. If you do not
              agree with these terms, you should not use the website or its
              services.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              These Terms apply to visitors, registered users, contributors,
              and anyone who accesses or interacts with CyberIncidents.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold">
              2. About CyberIncidents
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              CyberIncidents is a cybersecurity-focused platform that may
              provide cybersecurity news, analysis, educational material,
              security research, guides, incident information, and related
              content.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              The specific features and services available through the website
              may change over time.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold">
              3. Eligibility
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You may use CyberIncidents only if you are legally permitted to
              do so under the laws applicable to you.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              If you are under the minimum age required to use a particular
              service under applicable law, you must not create an account or
              provide personal information without the required authorization.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold">
              4. User Accounts
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Certain features may require you to create an account. You agree
              to provide accurate information and to keep your account
              information reasonably up to date.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You are responsible for maintaining the confidentiality of your
              account credentials and for activity occurring through your
              account.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You must notify CyberIncidents if you reasonably believe that
              your account has been compromised or accessed without
              authorization.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold">
              5. Acceptable Use
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You agree to use CyberIncidents only for lawful purposes and in a
              manner that does not interfere with the operation, security, or
              availability of the website.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You must not:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>
                Use the website for unlawful, fraudulent, or abusive purposes.
              </li>
              <li>
                Attempt to gain unauthorized access to accounts, systems,
                databases, or infrastructure.
              </li>
              <li>
                Attempt to bypass authentication, security controls, or access
                restrictions.
              </li>
              <li>
                Introduce malware, malicious code, or other harmful material.
              </li>
              <li>
                Conduct denial-of-service attacks or intentionally disrupt the
                website.
              </li>
              <li>
                Scrape, crawl, or collect website data in a manner that places
                unreasonable load on our systems.
              </li>
              <li>
                Impersonate another person, organization, or service.
              </li>
              <li>
                Use CyberIncidents to distribute spam, scams, or malicious
                content.
              </li>
              <li>
                Attempt to exploit vulnerabilities in CyberIncidents without
                authorization.
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold">
              6. Cybersecurity and Security Research Content
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              CyberIncidents may publish cybersecurity research, vulnerability
              information, malware analysis, incident reports, attack
              techniques, defensive techniques, proof-of-concept material, and
              other technical information.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Such content is provided for educational, informational, research,
              and defensive purposes unless expressly stated otherwise.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You are responsible for ensuring that your use of cybersecurity
              information complies with applicable laws, regulations,
              authorization requirements, and the rights of others.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              CyberIncidents does not authorize you to access, test, disrupt,
              damage, or interfere with systems that you do not own or have
              explicit permission to test.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-bold">
              7. User-Submitted Content
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              If CyberIncidents allows users to submit comments, articles,
              reports, research, messages, or other content, you remain
              responsible for the content you submit.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You represent that you have the necessary rights and permissions
              to submit the content and that your submission does not violate
              applicable law or the rights of another person.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You should not submit confidential information, credentials,
              private personal information, or sensitive information belonging
              to another person unless you are legally authorized to do so.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-bold">
              8. Intellectual Property
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Unless otherwise stated, CyberIncidents and its original
              materials, branding, design, software, graphics, text, and other
              content are owned by or licensed to CyberIncidents and are
              protected by applicable intellectual-property laws.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You may access and use website content for personal,
              informational, or educational purposes in accordance with these
              Terms.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You may not reproduce, redistribute, modify, sell, or commercially
              exploit CyberIncidents' protected content without appropriate
              authorization, except where permitted by applicable law.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-bold">
              9. Third-Party Content and Links
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              CyberIncidents may reference or link to third-party websites,
              services, research, tools, repositories, articles, or other
              resources.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Third-party resources are governed by their own terms and
              policies. CyberIncidents does not necessarily endorse or control
              third-party content and is not responsible for its availability,
              accuracy, security, or practices.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-bold">
              10. Accuracy of Information
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We aim to provide useful and accurate cybersecurity information,
              but information published on CyberIncidents may contain errors,
              omissions, outdated information, or interpretations that change
              over time.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You should independently verify important technical, security,
              legal, financial, or operational decisions using appropriate
              authoritative sources.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-bold">
              11. No Professional Advice
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Content published by CyberIncidents is generally provided for
              informational and educational purposes and should not be treated
              as professional legal, financial, cybersecurity, or other
              professional advice.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-bold">
              12. Website Availability
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We may modify, suspend, restrict, or discontinue any part of
              CyberIncidents at any time, including temporarily for
              maintenance, security updates, technical issues, or other
              operational reasons.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We do not guarantee that the website will always be available,
              uninterrupted, secure, or free from errors.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-2xl font-bold">
              13. Security
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We take reasonable measures to protect CyberIncidents and its
              users. However, no online service can guarantee complete security.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              You agree not to attempt to compromise the security or integrity
              of the website, its infrastructure, or other users' accounts.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-2xl font-bold">
              14. Account Suspension or Termination
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We may suspend or terminate access to an account or to parts of
              CyberIncidents where reasonably necessary, including where we
              believe that a user has violated these Terms, created a security
              risk, engaged in unlawful activity, abused the service, or
              otherwise threatened the integrity of the platform.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Where appropriate and permitted by applicable law, we may provide
              notice before taking such action.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-2xl font-bold">
              15. Limitation of Liability
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              To the maximum extent permitted by applicable law, CyberIncidents
              and its operators, contributors, and service providers will not
              be responsible for indirect, incidental, special, consequential,
              or punitive losses arising from or related to your use of the
              website.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Nothing in these Terms excludes or limits liability that cannot
              legally be excluded or limited under applicable law.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-2xl font-bold">
              16. Indemnification
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              To the extent permitted by applicable law, you agree to
              reasonably indemnify and hold harmless CyberIncidents and its
              operators from claims, losses, liabilities, damages, and
              expenses arising from your unlawful use of the website, violation
              of these Terms, or infringement of another person's rights.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-2xl font-bold">
              17. Privacy
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Your use of CyberIncidents is also subject to our Privacy Policy,
              which explains how information may be collected and processed.
            </p>

            <p className="mt-4">
              <Link
                href="/privacy"
                className="font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
              >
                Read our Privacy Policy →
              </Link>
            </p>
          </section>

          {/* 18 */}
          <section>
            <h2 className="text-2xl font-bold">
              18. Changes to These Terms
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              We may update these Terms from time to time to reflect changes
              to CyberIncidents, our services, or applicable legal
              requirements.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              The updated version will be published on this page with a revised
              "Last updated" date. Your continued use of CyberIncidents after
              changes become effective constitutes acceptance of the updated
              Terms to the extent permitted by applicable law.
            </p>
          </section>

          {/* 19 */}
          <section>
            <h2 className="text-2xl font-bold">
              19. Governing Law
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              These Terms will be interpreted and applied in accordance with
              applicable law. Where legally permitted, disputes relating to
              CyberIncidents will be subject to the jurisdiction of the
              appropriate courts or dispute-resolution mechanisms applicable
              to the operator of the service.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Nothing in this section is intended to remove or restrict
              mandatory consumer or other legal rights that apply to you in
              your jurisdiction.
            </p>
          </section>

          {/* 20 */}
          <section>
            <h2 className="text-2xl font-bold">
              20. Contact Us
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              If you have questions about these Terms, report a legal or
              security concern, or need assistance regarding your account,
              please contact CyberIncidents.
            </p>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="font-semibold">
                CyberIncidents
              </p>

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
            </div>
          </section>

          {/* Final note */}
          <section className="border-t border-slate-200 pt-8 dark:border-white/10">
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-500">
              These Terms are intended to establish general rules for using
              CyberIncidents. They should be reviewed and adapted if
              CyberIncidents introduces additional services, paid features,
              advertising, subscriptions, community functionality, or other
              material changes to the platform.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

