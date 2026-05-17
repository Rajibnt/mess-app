'use client';
import { AppState } from '../types';
import { totalExpenses, allTotalMeals, mealRate, totalMeals } from '../utils';
import { Calculator, ArrowRightLeft } from 'lucide-react';

export default function Report({ state }: { state: AppState }) {
  const total = totalExpenses(state);
  const meals = allTotalMeals(state);
  const rate = mealRate(state);

  // Calculate each member's net balance
  const memberBalances = state.members.map((m) => {
    const mealCost = Math.round(totalMeals(state, m.id) * rate);
    const paid = state.expenses.filter((e) => e.payer === m.id).reduce((s, e) => s + e.amount, 0);
    const net = m.deposit + paid - mealCost;
    return { ...m, mealCost, paid, net, mealCount: totalMeals(state, m.id) };
  });

  const debtors = memberBalances.filter((m) => m.net < 0);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'মোট খরচ', value: `৳${total.toLocaleString()}` },
          { label: 'মোট মিল', value: `${meals}টি` },
          { label: 'প্রতি মিল রেট', value: `৳${Math.round(rate)}` },
          { label: 'সদস্য প্রতি গড়', value: `৳${state.members.length ? Math.round(total / state.members.length) : 0}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Calculator size={16} /> সদস্য ভিত্তিক হিসাব
        </h3>
        {state.members.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">সদস্য নেই</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['সদস্য', 'মিল', 'মিল খরচ', 'জমা', 'পরিশোধ', 'ব্যালেন্স'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {memberBalances.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium">{m.name}</td>
                    <td className="py-3 px-3 text-gray-600">{m.mealCount}</td>
                    <td className="py-3 px-3 text-gray-600">৳{m.mealCost.toLocaleString()}</td>
                    <td className="py-3 px-3 text-gray-600">৳{m.deposit.toLocaleString()}</td>
                    <td className="py-3 px-3 text-gray-600">৳{m.paid.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${m.net >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {m.net >= 0 ? `+৳${m.net}` : `-৳${Math.abs(m.net)}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settlements */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <ArrowRightLeft size={16} /> বকেয়ার হিসাব
        </h3>
        {debtors.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-sm text-green-600 font-medium">সব হিসাব পরিষ্কার!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {debtors.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-xs font-medium text-red-600">
                  {m.name.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-400">পরিশোধ করতে হবে</p>
                </div>
                <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                  বকেয়া ৳{Math.abs(m.net).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
