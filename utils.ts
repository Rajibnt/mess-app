import { AppState } from './types';
import { MEAL_COUNT } from './constants';

export function totalMeals(state: AppState, memberId: number): number {
  return state.meals
    .filter((m) => m.memberId === memberId)
    .reduce((s, m) => s + MEAL_COUNT[m.type], 0);
}

export function allTotalMeals(state: AppState): number {
  return state.meals.reduce((s, m) => s + MEAL_COUNT[m.type], 0);
}

export function totalExpenses(state: AppState): number {
  return state.expenses.reduce((s, e) => s + e.amount, 0);
}

export function mealRate(state: AppState): number {
  const t = allTotalMeals(state);
  return t > 0 ? totalExpenses(state) / t : 0;
}

export function getMemberName(state: AppState, id: number): string {
  return state.members.find((m) => m.id === id)?.name || 'অজানা';
}
