'use client';
import { useState } from 'react';
import { AppState } from '../types';
import { totalMeals, allTotalMeals } from '../utils';
import { MEAL_COUNT } from '../constants';
import { UtensilsCrossed } from 'lucide-react';

interface Props {
  state: AppState;
  onAddMeal: (memberId: number, date: string, type: 'lunch' | 'dinner' | 'both') => void;
  onRemoveMeal: (id: number) => void;
}

export default function Meals({ state, onAddMeal, onRemoveMeal }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [memberId, setMemberId] = useState('');
  const [date, setDate] = useState(today);
  const [type, setType] = useState<'lunch' | 'dinner' | 'both'>('both');

  const handleAdd = () => {
    if (!memberId || !date) return alert('সদস্য ও তারিখ বেছে নিন');
    onAddMeal(parseInt(memberId), date, type);
    setMemberId('');
  };

  return (
    <div className="space-y-4">
      {/* Add Meal */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <UtensilsCrossed size={16} /> মিল এন্ট্রি দিন
        </h3>
        <div className="flex flex-wrap gap-2">
          <select
            className="flex-1 min-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          >
            <option value="">সদস্য বেছে নিন</option>
            {state.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input
            type="date"
            className="flex-1 min-w-[130px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className="flex-1 min-w-[120px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            value={type}
            onChange={(e) => setType(e.target.value as 'lunch' | 'dinner' | 'both')}
          >
            <option value="lunch">দুপুর</option>
            <option value="dinner">রাত</option>
            <option value="both">দুটোই</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            যোগ করুন
          </button>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">মিল সারসংক্ষেপ</h3>
        {state.members.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">সদস্য নেই</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">সদস্য</th>
                  <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">দুপুর</th>
                  <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">রাত</th>
                  <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">মোট মিল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {state.members.map((m) => {
                  const ml = state.meals.filter((x) => x.memberId === m.id);
                  const lunch = ml.filter((x) => x.type === 'lunch' || x.type === 'both').length;
                  const dinner = ml.filter((x) => x.type === 'dinner' || x.type === 'both').length;
                  return (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-700">
                            {m.name.slice(0, 2)}
                          </div>
                          {m.name}
                        </div>
                      </td>
                      <td className="text-center py-3 px-3 text-gray-700">{lunch}</td>
                      <td className="text-center py-3 px-3 text-gray-700">{dinner}</td>
                      <td className="text-center py-3 px-3 font-semibold">{totalMeals(state, m.id)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-3">মোট</td>
                  <td className="text-center py-3 px-3">{state.meals.filter(x => x.type === 'lunch' || x.type === 'both').length}</td>
                  <td className="text-center py-3 px-3">{state.meals.filter(x => x.type === 'dinner' || x.type === 'both').length}</td>
                  <td className="text-center py-3 px-3">{allTotalMeals(state)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Meal Entries */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">মিল এন্ট্রির তালিকা</h3>
        {state.meals.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">কোনো এন্ট্রি নেই</p>
        ) : (
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {[...state.meals].reverse().map((meal) => {
              const member = state.members.find((m) => m.id === meal.memberId);
              return (
                <div key={meal.id} className="flex items-center gap-3 py-2.5">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{member?.name || 'অজানা'}</p>
                    <p className="text-xs text-gray-400">{meal.date} · {meal.type === 'lunch' ? 'দুপুর' : meal.type === 'dinner' ? 'রাত' : 'দুপুর+রাত'} ({MEAL_COUNT[meal.type]} মিল)</p>
                  </div>
                  <button onClick={() => onRemoveMeal(meal.id)} className="text-red-300 hover:text-red-500 text-xs px-2 py-1 border border-red-100 rounded">বাদ</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
