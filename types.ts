export interface Member {
  id: number;
  name: string;
  deposit: number;
}

export interface Meal {
  id: number;
  memberId: number;
  date: string;
  type: 'lunch' | 'dinner' | 'both';
}

export interface Expense {
  id: number;
  desc: string;
  amount: number;
  date: string;
  payer: number;
  category: 'grocery' | 'gas' | 'utilities' | 'other';
}

export interface WeeklyMenu {
  [day: number]: {
    lunch: string;
    dinner: string;
  };
}

export interface AppState {
  members: Member[];
  meals: Meal[];
  expenses: Expense[];
  menu: WeeklyMenu;
}
