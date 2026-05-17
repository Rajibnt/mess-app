'use client';
import { useState, useEffect } from 'react';
import { AppState, WeeklyMenu } from '../types';
import { DAYS } from '../constants';
import { CalendarDays, Save } from 'lucide-react';

interface Props {
  state: AppState;
  onSaveMenu: (menu: WeeklyMenu) => void;
}

export default function Menu({ state, onSaveMenu }: Props) {
  const [localMenu, setLocalMenu] = useState<WeeklyMenu>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalMenu(state.menu || {});
  }, [state.menu]);

  const handleSave = () => {
    onSaveMenu(localMenu);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (day: number, meal: 'lunch' | 'dinner', value: string) => {
    setLocalMenu((prev) => ({
      ...prev,
      [day]: { ...(prev[day] || { lunch: '', dinner: '' }), [meal]: value },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Menu Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <CalendarDays size={16} /> সাপ্তাহিক মেনু সেট করুন
        </h3>
        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-3 gap-2 mb-1">
            <p className="text-xs text-gray-400 font-medium">দিন</p>
            <p className="text-xs text-gray-400 font-medium text-center">☀️ দুপুর</p>
            <p className="text-xs text-gray-400 font-medium text-center">🌙 রাত</p>
          </div>
          {DAYS.map((day, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <p className="text-sm text-gray-600 font-medium">{day}</p>
              <input
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                placeholder="রান্না..."
                value={(localMenu[i] || {}).lunch || ''}
                onChange={(e) => update(i, 'lunch', e.target.value)}
              />
              <input
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                placeholder="রান্না..."
                value={(localMenu[i] || {}).dinner || ''}
                onChange={(e) => update(i, 'dinner', e.target.value)}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'
          }`}
        >
          <Save size={15} />
          {saved ? 'সেভ হয়েছে!' : 'মেনু সেভ করুন'}
        </button>
      </div>

      {/* Display current menu */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">এই সপ্তাহের মেনু</h3>
        {Object.keys(state.menu || {}).length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">মেনু সেট করা হয়নি</p>
        ) : (
          <div className="space-y-2">
            {DAYS.map((day, i) => {
              const m = (state.menu || {})[i] || { lunch: '', dinner: '' };
              if (!m.lunch && !m.dinner) return null;
              return (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 font-medium">{day}</p>
                  <p className="text-sm text-gray-800">
                    {m.lunch && `☀️ ${m.lunch}`}
                    {m.lunch && m.dinner && ' · '}
                    {m.dinner && `🌙 ${m.dinner}`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
