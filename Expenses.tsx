'use client';
import { useState } from 'react';
import { AppState, Expense } from '../types';
import { getMemberName } from '../utils';
import { CAT_LABELS } from '../constants';
import { Receipt, X } from 'lucide-react';

interface Props {
  state: AppState;
  onAddExpense: (desc: string, amount: number, date: string, payer: number, category: Expense['category']) => void;
  onRemoveExpense: (id: number) => void;
}

export default function Expenses({ state, onAddExpense, onRemoveExpense }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today);
  const [payer, setPayer] = useState('');
  const [category, setCategory] = useState<Expense['category']>('grocery');

  const handleAdd = () => {
    if (!desc.trim() || !amount || !date || !payer) return alert('সব তথ্য পূরণ করুন');
    onAddExpense(desc.trim(), parseFloat(amount), date, parseInt(payer), category);
    setDesc('');
    setAmount('');
    setPayer('');
  };

  const total = state.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-4">
      {/* Add Expense */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Receipt size={16} /> খরচ যোগ করুন
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            placeholder="বিবরণ (যেমন: বাজার, গ্যাস)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            placeholder="পরিমাণ"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="date"
            className="flex-1 min-w-[130px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="flex-1 min-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
          >
            <option value="">কে দিয়েছেন?</option>
            {state.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select
            className="flex-1 min-w-[130px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            value={category}
            onChange={(e) => setCategory(e.target.value as Expense['category'])}
          >
            <option value="grocery">বাজার</option>
            <option value="gas">গ্যাস/জ্বালানি</option>
            <option value="utilities">ইউটিলিটি</option>
            <option value="other">অন্যান্য</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            যোগ করুন
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">খরচের তালিকা</h3>
          <span className="text-sm font-semibold text-gray-900">মোট: ৳{total.toLocaleString()}</span>
        </div>
        {state.expenses.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">কোনো খরচ নেই</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {[...state.expenses].reverse().map((e) => (
              <div key={e.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{e.desc}</p>
                  <p className="text-xs text-gray-400">
                    {e.date} · {getMemberName(state, e.payer)} ·{' '}
                    <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{CAT_LABELS[e.category]}</span>
                  </p>
                </div>
                <span className="text-sm font-semibold shrink-0">৳{e.amount.toLocaleString()}</span>
                <button
                  onClick={() => onRemoveExpense(e.id)}
                  className="text-red-300 hover:text-red-500 shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
