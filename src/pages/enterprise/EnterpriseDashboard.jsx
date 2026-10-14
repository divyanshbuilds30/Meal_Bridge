import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { csr } from '../../data/mockData';
import { formatINR, formatNumber } from '../../utils/format';
import { Stat } from '../../components/ui/Stat';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export function EnterpriseDashboard() {
  const { addToast } = useToast();

  const handleDownloadReport = () => {
    addToast('📄 Report download is a mock in Phase 1', 'info');
  };

  const handleDownloadReceipt = (no) => {
    addToast(`📄 Receipt ${no} downloaded (mock file)`, 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1">
            Corporate Social Responsibility (CSR) Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-ink">
            {csr.company}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reporting Period: <strong>{csr.period}</strong> • Audited Food Rescue & ESG Impact
          </p>
        </div>

        <Button size="md" onClick={handleDownloadReport} className="shadow-xs">
          📄 Download Q2 Impact Report
        </Button>
      </div>

      {/* KPI Row (4 Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Meals Delivered"
          value={formatNumber(csr.totals.meals)}
          icon="🍽"
          hint="Fed to verified local shelters"
        />
        <Stat
          label="Food Rescued"
          value={`${formatNumber(csr.totals.kg)} kg`}
          icon="📦"
          hint="Surplus diverted from landfill"
        />
        <Stat
          label="CO₂e Offset"
          value={`${formatNumber(csr.totals.co2eKg)} kg`}
          icon="🌍"
          hint="Emissions prevented"
        />
        <Stat
          label="Total Donations"
          value={formatNumber(csr.totals.donations)}
          icon="🤝"
          hint="Verified logistics handshakes"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Meals Bar Chart */}
        <Card className="p-5">
          <div className="mb-4">
            <h3 className="font-heading font-bold text-base text-ink">
              Meals Delivered Per Month
            </h3>
            <p className="text-xs text-slate-500">
              Monthly meal redistribution to partner orphanages and shelters
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={csr.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} meals`, "Meals Delivered"]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="meals" fill="#16A34A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly CO2e Line Chart */}
        <Card className="p-5">
          <div className="mb-4">
            <h3 className="font-heading font-bold text-base text-ink">
              CO₂e Saved (kg) Per Month
            </h3>
            <p className="text-xs text-slate-500">
              Greenhouse gas emissions prevented through landfill avoidance
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={csr.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} kg CO₂e`, "Emissions Saved"]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="co2e"
                  stroke="#0EA5E9"
                  strokeWidth={3}
                  dot={{ fill: '#0EA5E9', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ESG Formula & Summary Card */}
      <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-brand-900">
          <span className="text-lg">🌿</span>
          <span>
            <strong>ESG Emission Multiplier:</strong> CO₂e saved = food rescued (kg) × 2.5 kg CO₂e avoided from anaerobic landfill decomposition.
          </span>
        </div>
        <span className="font-mono text-brand-700 text-[11px] font-bold">
          GHG PROTOCOL SCOPE 3
        </span>
      </div>

      {/* Section 80G Receipts Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-bold text-base text-ink">
              Section 80G Tax Exemption Certificates
            </h3>
            <p className="text-xs text-slate-500">
              Tax exemption certificates issued under Section 80G of the Income Tax Act for verified food donations
            </p>
          </div>
          <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 self-start sm:self-auto">
            ✓ 100% Audit Compliant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Receipt No</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount Funded</th>
                <th className="py-3.5 px-4">Meals Rescued</th>
                <th className="py-3.5 px-5 text-right">Tax Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {csr.receipts.map((r) => (
                <tr key={r.no} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-ink">
                    {r.no}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {r.date}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-ink font-heading text-sm">
                    {formatINR(r.amountInr)}
                  </td>
                  <td className="py-3.5 px-4 text-brand-700 font-semibold">
                    {formatNumber(r.meals)} meals
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadReceipt(r.no)}
                      className="text-xs"
                    >
                      Download 80G 📄
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
