"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6", "#06B6D4", "#6B7280"];
const RISK_COLORS: Record<string, string> = {
  SAFE: "#22C55E",
  MODERATE: "#F59E0B",
  HIGH: "#F97316",
  DANGEROUS: "#EF4444",
};

export function StatisticsCharts({
  monthly,
  categories,
  risks,
}: {
  monthly: { month: string; fraud: number; positive: number }[];
  categories: { name: string; value: number }[];
  risks: { name: string; value: number }[];
}) {
  return (
    <div className="space-y-6">
      {/* Monthly Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Reports per Month</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="fraud" name="Fraud Reports" fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="positive" name="Positive Reviews" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fraud Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Fraud Categories</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categories.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Seller Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={risks} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {risks.map((r, i) => (
                  <Cell key={i} fill={RISK_COLORS[r.name] ?? PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
