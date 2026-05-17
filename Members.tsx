'use client';
import { useState } from 'react';
import { AppState, Member } from '../types';
import { totalMeals, mealRate } from '../utils';
import { Trash2, UserPlus } from 'lucide-react';

interface Props {
  state: AppState;
  onAddMember: (name: string, deposit: number) => void;
  onRemoveMember: (id: number) => void;
}

export default function Members({ state, onAddMember, onRemoveMember }: Props) {
  const [name, setName] = useState('');
  const [deposit, setDeposit] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return alert('নাম দিন');
    onAddMember(name.trim(), parseFloat(deposit) || 0);
    setName('');
    setDeposit('');
  };

  const rate = mealRate(state);

  return (
    <div className="space-y-4">
      {/* Add Member */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <UserPlus size={16} /> নতুন সদস্য যোগ করুন
        </h3>
        <div className="flex flex-wrap gap-2">
          <input
            className="flex-1 min-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            placeholder="সদস্যের নাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <input
            className="flex-1 min-w-[120px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            placeholder="জমা (টাকা)"
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            যোগ করুন
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">সদস্য তালিকা ({state.members.length} জন)</h3>
        {state.members.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">কোনো সদস্য নেই</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {state.members.map((m: Member) => {
              const meals = totalMeals(state, m.id);
              const mealCost = Math.round(meals * rate);
              const paid = state.expenses.filter((e) => e.payer === m.id).reduce((s, e) => s + e.amount, 0);
              const balance = m.deposit + paid - mealCost;

              return (
                <div key={m.id} className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                    {m.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">মিল: {meals} · জমা: ৳{m.deposit.toLocaleString()} · দিয়েছেন: ৳{paid.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${balance >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {balance >= 0 ? `বাকি ৳${balance}` : `বকেয়া ৳${Math.abs(balance)}`}
                    </span>
                    <button
                      onClick={() => { if (confirm('এই সদস্য মুছে ফেলবেন?')) onRemoveMember(m.id); }}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
