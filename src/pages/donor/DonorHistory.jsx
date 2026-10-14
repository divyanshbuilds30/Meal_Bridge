import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../utils/constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusChip } from '../../components/ui/StatusChip';
import { FreshnessRing } from '../../components/FreshnessRing';

export function DonorHistory() {
  const { currentDonorId, getDonor, posts, getDecay } = useApp();

  const donor = getDonor(currentDonorId);
  const donorPosts = posts.filter((p) => p.donorId === currentDonorId);
  // Sort newest first
  const sortedPosts = [...donorPosts].reverse();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-ink">
            Donation History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete audit trail of all surplus food posted by <strong>{donor?.name}</strong>.
          </p>
        </div>

        <Link to="/donor/new">
          <Button size="sm">+ Post New Surplus</Button>
        </Link>
      </div>

      {sortedPosts.length === 0 ? (
        <Card className="text-center py-16">
          <span className="text-4xl">📋</span>
          <h3 className="text-base font-bold text-ink mt-3">No donation history recorded yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Posts you create will appear here with an immutable audit log.
          </p>
          <Link to="/donor/new">
            <Button size="sm">Create First Post</Button>
          </Link>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Food Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Meals</th>
                  <th className="py-3.5 px-4">Freshness</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Passcard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedPosts.map((post) => {
                  const cat = CATEGORIES[post.category] || CATEGORIES.cooked;
                  const decay = getDecay(post);

                  return (
                    <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-ink">
                        <div className="flex items-center gap-2">
                          <span>{cat.emoji}</span>
                          <span>{post.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {cat.label}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {post.weightKg} kg
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-brand-700">
                        ≈ {post.meals}
                      </td>
                      <td className="py-3.5 px-4">
                        <FreshnessRing value={decay} size={38} strokeWidth={4} showLabel={false} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip status={post.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/donor/passcard/${post.id}`}>
                          <Button variant="secondary" size="sm" className="text-xs">
                            View Passcard
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {sortedPosts.map((post) => {
              const cat = CATEGORIES[post.category] || CATEGORIES.cooked;
              const decay = getDecay(post);

              return (
                <div key={post.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{cat.emoji}</span>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-ink">{post.title}</h4>
                        <p className="text-[11px] text-slate-500">{cat.label}</p>
                      </div>
                    </div>
                    <StatusChip status={post.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Weight</span>
                      <span className="font-bold text-ink">{post.weightKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Meals</span>
                      <span className="font-bold text-brand-700">≈ {post.meals}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Decay</span>
                      <FreshnessRing value={decay} size={32} strokeWidth={4} showLabel={false} />
                    </div>
                  </div>

                  <Link to={`/donor/passcard/${post.id}`} className="block">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      View Passcard →
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
