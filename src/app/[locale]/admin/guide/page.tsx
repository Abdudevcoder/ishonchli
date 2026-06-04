import { getLocale } from "next-intl/server";
import Link from "next/link";

export default async function AdminGuidePage() {
  const locale = await getLocale();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Guide</h1>
          <p className="text-sm text-gray-500 mt-1">Complete documentation for using the Ishonchli.uz admin panel</p>
        </div>
        <Link
          href={`/${locale}/admin`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Table of Contents */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-blue-800 mb-3 text-sm uppercase tracking-wide">Table of Contents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {[
            { href: "#login", label: "1. Logging In as Admin" },
            { href: "#overview", label: "2. Admin Panel Overview" },
            { href: "#dashboard", label: "3. Dashboard" },
            { href: "#moderation", label: "4. Reports Moderation" },
            { href: "#users", label: "5. User Management" },
            { href: "#statistics", label: "6. Statistics" },
            { href: "#settings", label: "7. Settings" },
            { href: "#public", label: "8. Using the Public Site" },
            { href: "#trust", label: "9. Trust Score System" },
            { href: "#antifraud", label: "10. Anti-Fraud Detection" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-blue-700 hover:text-blue-900 hover:underline"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-10 text-gray-700">

        {/* Section 1 */}
        <section id="login">
          <SectionTitle number="1" title="Logging In as Admin" />
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">
              Open the site and click <strong>Login</strong> in the top navigation bar. Enter the admin credentials below, then click Login.
            </p>
            <CredentialsBox email="admin@ishonchli.uz" password="Password123!" />
            <p className="text-sm leading-relaxed">
              After login, your name appears in the navbar and an <strong>Admin</strong> link becomes visible. The site defaults to Uzbek — use the <strong>UZ / RU / EN</strong> switcher in the top-right to change the language.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="overview">
          <SectionTitle number="2" title="Admin Panel Overview" />
          <p className="text-sm leading-relaxed mb-3">
            Click the <strong>Admin</strong> link in the navbar to enter the admin panel. The dark sidebar on the left contains 5 sections:
          </p>
          <Table
            headers={["Section", "URL", "Purpose"]}
            rows={[
              ["Dashboard", "/admin", "Overview stats and pending reports queue"],
              ["Reports", "/admin/reports", "Moderate all submitted reports"],
              ["Users", "/admin/users", "Manage registered users"],
              ["Statistics", "/admin/statistics", "Charts and analytics"],
              ["Settings", "/admin/settings", "View fraud detection configuration"],
              ["Guide", "/admin/guide", "This documentation page"],
            ]}
          />
          <p className="text-sm text-gray-500 mt-3">
            Use <strong>← Back to Site</strong> at the bottom of the sidebar to return to the public site.
          </p>
        </section>

        {/* Section 3 */}
        <section id="dashboard">
          <SectionTitle number="3" title="Dashboard" />
          <p className="text-sm leading-relaxed mb-3">The dashboard is the first screen after entering the admin panel.</p>

          <Subheading>Statistics Cards</Subheading>
          <Table
            headers={["Card", "What it shows"]}
            rows={[
              ["Total Users", "All registered accounts"],
              ["Total Sellers", "All sellers tracked in the system"],
              ["Total Reports", "All reports ever submitted"],
              ["Approved", "Reports approved by admin"],
              ["Rejected", "Reports rejected by admin"],
              ["Pending", "Reports waiting for your review"],
              ["Confirmed Fraud", "Approved fraud-type reports only"],
              ["New Today", "Reports submitted today"],
            ]}
          />

          <Subheading>Pending Reports Table</Subheading>
          <p className="text-sm leading-relaxed">
            Below the cards is a live table of the 8 most recent pending reports. Each row shows the type, seller, reporter, date, and a <strong>Review</strong> link to the full moderation page.
          </p>
          <Callout type="tip">
            Check this table every time you log in. A growing pending queue means trust scores are stale — buyers see outdated risk levels until you take action.
          </Callout>
        </section>

        {/* Section 4 */}
        <section id="moderation">
          <SectionTitle number="4" title="Reports Moderation" />
          <p className="text-sm leading-relaxed mb-3">
            All reports submitted by users pass through this page before affecting any seller trust score. Go to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/admin/reports</code>.
          </p>

          <Subheading>Filter Tabs</Subheading>
          <Table
            headers={["Tab", "Shows"]}
            rows={[
              ["All", "Every report regardless of status"],
              ["Pending", "Reports waiting for review"],
              ["Approved", "Reports already approved"],
              ["Rejected", "Reports already rejected"],
            ]}
          />

          <Subheading>Report Table Columns</Subheading>
          <Table
            headers={["Column", "Description"]}
            rows={[
              ["Report", "Type badge (Fraud/Positive), category, and description preview"],
              ["Seller", "Telegram username, marketplace name, or phone number"],
              ["Reporter", "Full name and email of the submitting user"],
              ["Status", "Current status: Pending / Approved / Rejected"],
              ["Date", "Submission date"],
              ["Actions", "Approve, Reject, and Delete buttons"],
            ]}
          />

          <Subheading>Action Buttons</Subheading>
          <div className="space-y-3">
            <ActionCard
              color="green"
              label="Approve"
              description="Report status becomes APPROVED. The seller's trust score recalculates immediately — positive reviews add points, fraud reports deduct points. Suspicious/fraudster flags are also re-evaluated."
            />
            <ActionCard
              color="red"
              label="Reject"
              description="Report status becomes REJECTED. Rejected reports do NOT affect the seller's trust score. Use this for spam, duplicates, or unsubstantiated claims."
            />
            <ActionCard
              color="gray"
              label="Delete"
              description="Permanently deletes the report from the database after confirmation. Use only for abusive or illegal content."
            />
          </div>

          <Callout type="warning">
            Only <strong>approved</strong> reports affect seller trust scores. You must actively review pending reports for the system to reflect reality.
          </Callout>
        </section>

        {/* Section 5 */}
        <section id="users">
          <SectionTitle number="5" title="User Management" />
          <p className="text-sm leading-relaxed mb-3">
            Lists every registered user. Go to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/admin/users</code>.
          </p>

          <Table
            headers={["Column", "Description"]}
            rows={[
              ["User", "Full name and email address"],
              ["Role", "USER or ADMIN badge"],
              ["Reports", "Number of reports this user submitted"],
              ["Joined", "Account creation date"],
              ["Actions", "Promote/demote and delete buttons"],
            ]}
          />

          <div className="space-y-3 mt-4">
            <ActionCard
              color="blue"
              label="Make Admin"
              description="Promotes the user to ADMIN role. They immediately gain access to this admin panel and can moderate reports and manage users."
            />
            <ActionCard
              color="yellow"
              label="Revoke Admin"
              description="Reverts the user to USER role. They lose admin panel access. Note: you cannot revoke your own admin status."
            />
            <ActionCard
              color="red"
              label="Delete"
              description="Permanently deletes the user and ALL their reports, comments, and votes (cascade delete). This may allow bad sellers to recover their trust scores — use carefully."
            />
          </div>
        </section>

        {/* Section 6 */}
        <section id="statistics">
          <SectionTitle number="6" title="Statistics" />
          <p className="text-sm leading-relaxed mb-4">
            Three interactive charts at <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/admin/statistics</code>. Hover over any chart element to see exact numbers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "📊",
                title: "Reports per Month",
                type: "Bar Chart",
                desc: "Red bars = fraud reports, green bars = positive reviews. Shows last 6 months. Spikes in fraud may indicate a scam campaign.",
              },
              {
                icon: "🥧",
                title: "Fraud Categories",
                type: "Pie Chart",
                desc: "Breakdown of fraud types: Scam, Fake Product, Non Delivery, Payment Fraud, Account Theft, Other. Identifies the most common fraud pattern.",
              },
              {
                icon: "🥧",
                title: "Seller Risk Distribution",
                type: "Pie Chart",
                desc: "How many sellers are in each risk level. Green = Safe, Yellow = Moderate, Orange = High, Red = Dangerous.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-gray-800 text-sm mb-0.5">{c.title}</div>
                <div className="text-xs text-blue-600 mb-2">{c.type}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7 */}
        <section id="settings">
          <SectionTitle number="7" title="Settings" />
          <p className="text-sm leading-relaxed mb-3">
            Read-only page showing the active fraud detection rules. To change values, edit{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">src/lib/trust-score.ts</code> and redeploy.
          </p>

          <Subheading>Fraud Detection Rules</Subheading>
          <Table
            headers={["Rule", "Current Value"]}
            rows={[
              ["Suspicious threshold", "> 3 complaints in 7 days"],
              ["Potential fraudster threshold", "> 5 confirmed fraud reports"],
              ["Positive review weight", "+3 points each"],
              ["Fraud report weight", "−5 points each"],
              ["Confirmed fraud additional penalty", "−10 points each"],
            ]}
          />

          <Subheading>Upload Limits</Subheading>
          <Table
            headers={["Setting", "Value"]}
            rows={[
              ["Allowed formats", "PNG, JPG, JPEG"],
              ["Max file size", "10 MB"],
              ["Storage provider", "Cloudinary"],
            ]}
          />
        </section>

        {/* Section 8 */}
        <section id="public">
          <SectionTitle number="8" title="Using the Public Site as Admin" />
          <p className="text-sm leading-relaxed mb-3">
            As admin you have full access to the public site. Use <strong>← Back to Site</strong> in the sidebar to return.
          </p>

          <div className="space-y-4">
            {[
              {
                title: "Searching Sellers",
                steps: [
                  "Click Sellers in the navbar or go to /search",
                  "Enter a phone number, Telegram username, or marketplace username",
                  "Results show as cards with trust score and risk badge",
                  "Click any card to open the full seller profile",
                ],
              },
              {
                title: "Seller Profile",
                steps: [
                  "Shows all contact identifiers (phone, Telegram, marketplace)",
                  "Trust score bar with current risk level",
                  "⚠ Suspicious and 🚨 Potential Fraudster warning banners if flagged",
                  "Count of fraud reports vs positive reviews",
                  "All approved reports listed with full descriptions",
                ],
              },
              {
                title: "Report Detail Page",
                steps: [
                  "Full description, category, and status badge",
                  "Evidence screenshot if uploaded",
                  "Community comments and upvote/downvote counts",
                  "Link back to the seller profile",
                ],
              },
            ].map((block) => (
              <div key={block.title} className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">{block.title}</h4>
                <ul className="space-y-1">
                  {block.steps.map((s) => (
                    <li key={s} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9 */}
        <section id="trust">
          <SectionTitle number="9" title="Trust Score System" />
          <p className="text-sm leading-relaxed mb-4">
            Every seller starts with a score of <strong>50</strong> when first added. The score recalculates automatically each time you approve or reject a report.
          </p>

          <div className="bg-gray-900 text-green-400 rounded-xl p-5 font-mono text-sm mb-4">
            <p className="text-gray-400 mb-1">{"// Formula"}</p>
            <p>Score = 50</p>
            <p className="pl-8 text-green-300">+ (approved positive reviews × 3)</p>
            <p className="pl-8 text-red-400">− (approved fraud reports × 5)</p>
            <p className="pl-8 text-red-400">− (approved fraud reports × 10){"  "}
              <span className="text-gray-500">{"// confirmed penalty"}</span>
            </p>
            <p className="mt-2 text-gray-400">{"// Clamped to [0, 100]"}</p>
          </div>

          <Table
            headers={["Score", "Risk Level", "Color", "Meaning"]}
            rows={[
              ["80 – 100", "Safe", "🟢 Green", "Trustworthy seller"],
              ["50 – 79", "Moderate Risk", "🟡 Yellow", "Some concerns, proceed with caution"],
              ["20 – 49", "High Risk", "🟠 Orange", "Multiple complaints, not recommended"],
              ["0 – 19", "Dangerous", "🔴 Red", "Severe fraud history, avoid"],
            ]}
          />
        </section>

        {/* Section 10 */}
        <section id="antifraud">
          <SectionTitle number="10" title="Anti-Fraud Detection Rules" />
          <p className="text-sm leading-relaxed mb-4">
            Two automatic flags are applied on top of the trust score to highlight dangerous patterns in real time.
          </p>

          <div className="space-y-4">
            <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <h4 className="font-semibold text-yellow-800">Suspicious Flag</h4>
              </div>
              <p className="text-sm text-yellow-700 mb-2">
                <strong>Condition:</strong> Seller receives more than 3 fraud complaints within the last 7 days.
              </p>
              <p className="text-sm text-yellow-700 mb-2">
                <strong>Effect:</strong> A warning banner appears on the seller profile and search cards.
              </p>
              <p className="text-sm text-yellow-700">
                <strong>Admin action:</strong> Review the recent reports immediately. Approve valid ones to drop the trust score accordingly.
              </p>
            </div>

            <div className="border border-red-200 bg-red-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🚨</span>
                <h4 className="font-semibold text-red-800">Potential Fraudster Flag</h4>
              </div>
              <p className="text-sm text-red-700 mb-2">
                <strong>Condition:</strong> Seller has more than 5 approved (confirmed) fraud reports in total.
              </p>
              <p className="text-sm text-red-700 mb-2">
                <strong>Effect:</strong> A permanent red banner appears on the seller profile.
              </p>
              <p className="text-sm text-red-700">
                <strong>Admin action:</strong> This is a serious flag. If reports were made in error, reject them — the flag recalculates automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section id="quickref" className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Reference — Daily Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Daily Check",
                steps: [
                  "Login → check Dashboard pending count",
                  "Go to Reports → Pending tab",
                  "Read each description carefully",
                  "Approve legitimate reports",
                  "Reject spam / duplicates",
                ],
                color: "blue",
              },
              {
                title: "Handling User Complaints",
                steps: [
                  "Go to Users, find by email",
                  "Check their report count",
                  "Go to Reports, find their submissions",
                  "Take moderation action",
                ],
                color: "purple",
              },
              {
                title: "Clearing a Seller",
                steps: [
                  "Go to Reports, search by seller",
                  "Reject unsubstantiated reports",
                  "Score recalculates automatically",
                  "Risk level updates on profile",
                ],
                color: "green",
              },
            ].map((block) => (
              <div key={block.title} className={`bg-white border border-gray-200 rounded-xl p-4`}>
                <h4 className="font-semibold text-gray-800 text-sm mb-3">{block.title}</h4>
                <ol className="space-y-1.5">
                  {block.steps.map((s, i) => (
                    <li key={s} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="font-bold text-gray-400 flex-shrink-0">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
        {number}
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
  );
}

function Subheading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-gray-700 text-sm mt-4 mb-2">{children}</h3>;
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-medium text-gray-600 text-xs uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 text-gray-700 ${j === 0 ? "font-medium" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ type, children }: { type: "tip" | "warning"; children: React.ReactNode }) {
  const styles = {
    tip: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };
  const icons = { tip: "💡", warning: "⚠️" };
  return (
    <div className={`mt-3 rounded-xl border px-4 py-3 text-sm flex items-start gap-2 ${styles[type]}`}>
      <span className="flex-shrink-0">{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}

function CredentialsBox({ email, password }: { email: string; password: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm space-y-1">
      <div>
        <span className="text-gray-400">Email:    </span>
        <span className="text-green-400">{email}</span>
      </div>
      <div>
        <span className="text-gray-400">Password: </span>
        <span className="text-green-400">{password}</span>
      </div>
    </div>
  );
}

function ActionCard({ color, label, description }: { color: string; label: string; description: string }) {
  const styles: Record<string, string> = {
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    gray: "bg-gray-50 border-gray-200",
    blue: "bg-blue-50 border-blue-200",
    yellow: "bg-yellow-50 border-yellow-200",
    purple: "bg-purple-50 border-purple-200",
  };
  const badges: Record<string, string> = {
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    gray: "bg-gray-400 text-white",
    blue: "bg-blue-500 text-white",
    yellow: "bg-yellow-400 text-white",
    purple: "bg-purple-500 text-white",
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[color] ?? styles.gray}`}>
      <div className="flex items-start gap-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${badges[color] ?? badges.gray}`}>
          {label}
        </span>
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
