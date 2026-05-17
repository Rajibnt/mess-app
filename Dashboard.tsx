'use client';
import { AppState } from '../types';
import { totalExpenses, allTotalMeals, mealRate, getMemberName } from '../utils';
import { CAT_LABELS } from '../constants';

export default function Dashboard({ state }: { state: AppState }) {
  const total = totalExpenses(state);
  const meals = allTotalMeals(state);
  const rate = mealRate(state);
  const recent = [...state.expenses].reverse().slice(0, 5);

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'মোট খরচ', value: `৳${total.toLocaleString()}`, sub: 'এই মাসে' },
          { label: 'প্রতি মিল', value: `৳${Math.round(rate)}`, sub: 'বর্তমান রেট' },
          { label: 'মোট মিল', value: `${meals}`, sub: `${state.meals.length}টি এন্ট্রি` },
          { label: 'সদস্য', value: `${state.members.length}`, sub: 'সক্রিয়' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">সাম্প্রতিক খরচ</h3>
        {recent.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">কোনো খরচ নেই</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((e) => (
              <div key={e.id} className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-xs font-medium text-green-700 shrink-0">
                  {getMemberName(state, e.payer).slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{e.desc}</p>
                  <p className="text-xs text-gray-400">{e.date} · {getMemberName(state, e.payer)} · <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs">{CAT_LABELS[e.category]}</span></p>
                </div>
                <p className="text-sm font-semibold text-gray-800 shrink-0">৳{e.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
