export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Fraud Detection Rules</h2>
          <div className="space-y-4 text-sm">
            {[
              { label: "Suspicious Threshold", desc: "Mark seller suspicious after N complaints in 7 days", value: "3 complaints" },
              { label: "Potential Fraudster Threshold", desc: "Mark as potential fraudster after N confirmed fraud reports", value: "5 confirmed reports" },
              { label: "Trust Score: Positive Weight", desc: "Points added per approved positive review", value: "+3 per review" },
              { label: "Trust Score: Negative Weight", desc: "Points deducted per approved fraud report", value: "-5 per report" },
              { label: "Trust Score: Confirmed Fraud Weight", desc: "Additional points deducted per confirmed fraud", value: "-10 per confirmed" },
            ].map((rule) => (
              <div key={rule.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <div className="font-medium text-gray-800">{rule.label}</div>
                  <div className="text-xs text-gray-400">{rule.desc}</div>
                </div>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{rule.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            These values are configured in the codebase at <code className="bg-gray-100 px-1 rounded">src/lib/trust-score.ts</code>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Risk Level Ranges</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "Safe", range: "80–100", color: "text-green-600 bg-green-50" },
              { label: "Moderate Risk", range: "50–79", color: "text-yellow-600 bg-yellow-50" },
              { label: "High Risk", range: "20–49", color: "text-orange-600 bg-orange-50" },
              { label: "Dangerous", range: "0–19", color: "text-red-600 bg-red-50" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${r.color}`}>{r.label}</span>
                <span className="text-gray-500 font-mono">{r.range}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-2">Upload Limits</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between"><span>Allowed formats</span><span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">PNG, JPG, JPEG</span></div>
            <div className="flex justify-between"><span>Max file size</span><span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">10 MB</span></div>
            <div className="flex justify-between"><span>Storage provider</span><span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">Cloudinary</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
