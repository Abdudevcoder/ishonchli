import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AdminGuidePage() {
  const locale = await getLocale();
  const t = await getTranslations("guide");

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <Link href={`/${locale}/admin`} className="text-sm text-blue-600 hover:underline">
          ← {t("back")}
        </Link>
      </div>

      {/* Table of Contents */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-blue-800 mb-3 text-sm uppercase tracking-wide">{t("toc_title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {(["login","overview","dashboard","moderation","users","statistics","settings","public","trust","antifraud"] as const).map((key) => (
            <a key={key} href={`#${key}`} className="text-sm text-blue-700 hover:text-blue-900 hover:underline">
              {t(`toc.${key}`)}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-10 text-gray-700">

        {/* Section 1 — Login */}
        <section id="login">
          <SectionTitle number="1" title={t("s1_title")} />
          <p className="text-sm leading-relaxed mb-3">{t("s1_desc")}</p>
          <CredentialsBox email="admin@ishonchli.uz" password="Password123!" />
          <p className="text-sm leading-relaxed mt-3">{t("s1_note")}</p>
        </section>

        {/* Section 2 — Overview */}
        <section id="overview">
          <SectionTitle number="2" title={t("s2_title")} />
          <p className="text-sm leading-relaxed mb-3">{t("s2_desc")}</p>
          <Table
            headers={[t("s2_col_section"), t("s2_col_url"), t("s2_col_purpose")]}
            rows={t.raw("s2_rows") as string[][]}
          />
          <p className="text-sm text-gray-500 mt-3">{t("s2_note")}</p>
        </section>

        {/* Section 3 — Dashboard */}
        <section id="dashboard">
          <SectionTitle number="3" title={t("s3_title")} />
          <p className="text-sm leading-relaxed mb-3">{t("s3_desc")}</p>
          <Subheading>{t("s3_cards_title")}</Subheading>
          <Table headers={["", ""]} rows={t.raw("s3_cards") as string[][]} hideHeader />
          <Subheading>{t("s3_pending_title")}</Subheading>
          <p className="text-sm leading-relaxed">{t("s3_pending_desc")}</p>
          <Callout type="tip">{t("s3_tip")}</Callout>
        </section>

        {/* Section 4 — Reports Moderation */}
        <section id="moderation">
          <SectionTitle number="4" title={t("s4_title")} />
          <p className="text-sm leading-relaxed mb-3">{t("s4_desc")}</p>
          <Subheading>{t("s4_filter_title")}</Subheading>
          <Table headers={["", ""]} rows={t.raw("s4_filter_rows") as string[][]} hideHeader />
          <Subheading>{t("s4_cols_title")}</Subheading>
          <Table headers={["", ""]} rows={t.raw("s4_cols_rows") as string[][]} hideHeader />
          <Subheading>{t("s4_actions_title")}</Subheading>
          <div className="space-y-3">
            <ActionCard color="green" label="Approve" description={t("s4_approve_desc")} />
            <ActionCard color="red" label="Reject" description={t("s4_reject_desc")} />
            <ActionCard color="gray" label="Delete" description={t("s4_delete_desc")} />
          </div>
          <Callout type="warning">{t("s4_warning")}</Callout>
        </section>

        {/* Section 5 — Users */}
        <section id="users">
          <SectionTitle number="5" title={t("s5_title")} />
          <p className="text-sm leading-relaxed mb-3">{t("s5_desc")}</p>
          <Table headers={["", ""]} rows={t.raw("s5_cols") as string[][]} hideHeader />
          <div className="space-y-3 mt-4">
            <ActionCard color="blue" label="Make Admin" description={t("s5_make_admin_desc")} />
            <ActionCard color="yellow" label="Revoke Admin" description={t("s5_revoke_desc")} />
            <ActionCard color="red" label="Delete" description={t("s5_delete_desc")} />
          </div>
        </section>

        {/* Section 6 — Statistics */}
        <section id="statistics">
          <SectionTitle number="6" title={t("s6_title")} />
          <p className="text-sm leading-relaxed mb-4">{t("s6_desc")}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📊", titleKey: "s6_chart1_title", typeKey: "s6_chart1_type", descKey: "s6_chart1_desc" },
              { icon: "🥧", titleKey: "s6_chart2_title", typeKey: "s6_chart2_type", descKey: "s6_chart2_desc" },
              { icon: "🥧", titleKey: "s6_chart3_title", typeKey: "s6_chart3_type", descKey: "s6_chart3_desc" },
            ].map((c) => (
              <div key={c.titleKey} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-gray-800 text-sm mb-0.5">{t(c.titleKey as Parameters<typeof t>[0])}</div>
                <div className="text-xs text-blue-600 mb-2">{t(c.typeKey as Parameters<typeof t>[0])}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{t(c.descKey as Parameters<typeof t>[0])}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7 — Settings */}
        <section id="settings">
          <SectionTitle number="7" title={t("s7_title")} />
          <p className="text-sm leading-relaxed mb-3">{t("s7_desc")}</p>
          <Subheading>{t("s7_rules_title")}</Subheading>
          <Table headers={["", ""]} rows={t.raw("s7_rules") as string[][]} hideHeader />
          <Subheading>{t("s7_upload_title")}</Subheading>
          <Table headers={["", ""]} rows={t.raw("s7_upload") as string[][]} hideHeader />
        </section>

        {/* Section 8 — Public Site */}
        <section id="public">
          <SectionTitle number="8" title={t("s8_title")} />
          <p className="text-sm leading-relaxed mb-3">{t("s8_desc")}</p>
          <div className="space-y-4">
            {[
              { titleKey: "s8_search_title", stepsKey: "s8_search_steps" },
              { titleKey: "s8_profile_title", stepsKey: "s8_profile_steps" },
              { titleKey: "s8_report_title", stepsKey: "s8_report_steps" },
            ].map((block) => (
              <div key={block.titleKey} className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  {t(block.titleKey as Parameters<typeof t>[0])}
                </h4>
                <ul className="space-y-1">
                  {(t.raw(block.stepsKey as Parameters<typeof t>[0]) as string[]).map((step, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9 — Trust Score */}
        <section id="trust">
          <SectionTitle number="9" title={t("s9_title")} />
          <p className="text-sm leading-relaxed mb-4">{t("s9_desc")}</p>
          <div className="bg-gray-900 text-green-400 rounded-xl p-5 font-mono text-sm mb-4">
            <p className="text-gray-400 mb-1">{"// Formula"}</p>
            <p>Score = 50</p>
            <p className="pl-8 text-green-300">+ (approved positive reviews × 3)</p>
            <p className="pl-8 text-red-400">− (approved fraud reports × 5)</p>
            <p className="pl-8 text-red-400">− (approved fraud reports × 10)</p>
            <p className="mt-2 text-gray-400">{"// Clamped to [0, 100]"}</p>
          </div>
          <Table
            headers={["Score", "Risk Level", "Color", "Meaning"]}
            rows={t.raw("s9_table") as string[][]}
          />
        </section>

        {/* Section 10 — Anti-Fraud */}
        <section id="antifraud">
          <SectionTitle number="10" title={t("s10_title")} />
          <p className="text-sm leading-relaxed mb-4">{t("s10_desc")}</p>
          <div className="space-y-4">
            <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <h4 className="font-semibold text-yellow-800">{t("s10_sus_title")}</h4>
              </div>
              <p className="text-sm text-yellow-700 mb-2"><strong>{t("s10_sus_condition")}</strong></p>
              <p className="text-sm text-yellow-700 mb-2">{t("s10_sus_effect")}</p>
              <p className="text-sm text-yellow-700">{t("s10_sus_action")}</p>
            </div>
            <div className="border border-red-200 bg-red-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🚨</span>
                <h4 className="font-semibold text-red-800">{t("s10_fraud_title")}</h4>
              </div>
              <p className="text-sm text-red-700 mb-2"><strong>{t("s10_fraud_condition")}</strong></p>
              <p className="text-sm text-red-700 mb-2">{t("s10_fraud_effect")}</p>
              <p className="text-sm text-red-700">{t("s10_fraud_action")}</p>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">⚡ {t("qr_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { titleKey: "qr1_title", stepsKey: "qr1_steps" },
              { titleKey: "qr2_title", stepsKey: "qr2_steps" },
              { titleKey: "qr3_title", stepsKey: "qr3_steps" },
            ].map((block) => (
              <div key={block.titleKey} className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-3">
                  {t(block.titleKey as Parameters<typeof t>[0])}
                </h4>
                <ol className="space-y-1.5">
                  {(t.raw(block.stepsKey as Parameters<typeof t>[0]) as string[]).map((step, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="font-bold text-gray-400 flex-shrink-0">{i + 1}.</span>
                      {step}
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

function Table({ headers, rows, hideHeader }: { headers: string[]; rows: string[][]; hideHeader?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        {!hideHeader && (
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left px-4 py-2.5 font-medium text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 text-gray-700 ${j === 0 ? "font-medium" : ""}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ type, children }: { type: "tip" | "warning"; children: React.ReactNode }) {
  const styles = { tip: "bg-blue-50 border-blue-200 text-blue-800", warning: "bg-amber-50 border-amber-200 text-amber-800" };
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
      <div><span className="text-gray-400">Email:    </span><span className="text-green-400">{email}</span></div>
      <div><span className="text-gray-400">Password: </span><span className="text-green-400">{password}</span></div>
    </div>
  );
}

function ActionCard({ color, label, description }: { color: string; label: string; description: string }) {
  const styles: Record<string, string> = {
    green: "bg-green-50 border-green-200", red: "bg-red-50 border-red-200",
    gray: "bg-gray-50 border-gray-200", blue: "bg-blue-50 border-blue-200",
    yellow: "bg-yellow-50 border-yellow-200",
  };
  const badges: Record<string, string> = {
    green: "bg-green-500 text-white", red: "bg-red-500 text-white",
    gray: "bg-gray-400 text-white", blue: "bg-blue-500 text-white",
    yellow: "bg-yellow-400 text-white",
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[color] ?? styles.gray}`}>
      <div className="flex items-start gap-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${badges[color] ?? badges.gray}`}>{label}</span>
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
