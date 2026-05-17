'use client';
import { useState, useEffect } from 'react';
import { AppState, Expense, WeeklyMenu } from './types';
import { loadState, saveState } from './storage';
import { BANGLA_MONTHS } from './constants';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Meals from './components/Meals';
import Expenses from './components/Expenses';
import Menu from './components/Menu';
import Report from './components/Report';
import { LayoutDashboard, Users, UtensilsCrossed, Receipt, CalendarDays, FileText } from 'lucide-react';

type Tab = 'dashboard' | 'members' | 'meals' | 'expenses' | 'menu' | 'report';

const TABS = [
  { id: 'dashboard' as Tab, label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { id: 'members' as Tab, label: 'সদস্য', icon: Users },
  { id: 'meals' as Tab, label: 'মিল', icon: UtensilsCrossed },
  { id: 'expenses' as Tab, label: 'খরচ', icon: Receipt },
  { id: 'menu' as Tab, label: 'মেনু', icon: CalendarDays },
  { id: 'report' as Tab, label: 'হিসাব', icon: FileText },
];

export default function Home() {
  const [state, setState] = useState<AppState>({ members: [], meals: [], expenses: [], menu: {} });
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(loadState());
    setMounted(true);
  }, []);

  const update = (newState: AppState) => {
    setState(newState);
    saveState(newState);
  };

  const addMember = (name: string, deposit: number) =>
    update({ ...state, members: [...state.members, { id: Date.now(), name, deposit }] });

  const removeMember = (id: number) =>
    update({ ...state, members: state.members.filter(m => m.id !== id), meals: state.meals.filter(m => m.memberId !== id) });

  const addMeal = (memberId: number, date: string, type: 'lunch' | 'dinner' | 'both') =>
    update({ ...state, meals: [...state.meals, { id: Date.now(), memberId, date, type }] });

  const removeMeal = (id: number) =>
    update({ ...state, meals: state.meals.filter(m => m.id !== id) });

  const addExpense = (desc: string, amount: number, date: string, payer: number, category: Expense['category']) =>
    update({ ...state, expenses: [...state.expenses, { id: Date.now(), desc, amount, date, payer, category }] });

  const removeExpense = (id: number) =>
    update({ ...state, expenses: state.expenses.filter(e => e.id !== id) });

  const saveMenu = (menu: WeeklyMenu) =>
    update({ ...state, menu });

  const now = new Date();
  const monthLabel = `${BANGLA_MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">অফিস মেস ম্যানেজার</h1>
            <p className="text-xs text-gray-400">{monthLabel}</p>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{state.members.length} সদস্য</span>
        </div>
        <div className="max-w-3xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        {activeTab === 'dashboard' && <Dashboard state={state} />}
        {activeTab === 'members' && <Members state={state} onAddMember={addMember} onRemoveMember={removeMember} />}
        {activeTab === 'meals' && <Meals state={state} onAddMeal={addMeal} onRemoveMeal={removeMeal} />}
        {activeTab === 'expenses' && <Expenses state={state} onAddExpense={addExpense} onRemoveExpense={removeExpense} />}
        {activeTab === 'menu' && <Menu state={state} onSaveMenu={saveMenu} />}
        {activeTab === 'report' && <Report state={state} />}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-300">ডেটা browser-এ সেভ থাকে · অফিস মেস ম্যানেজার</p>
      </footer>
    </div>
  );
}
