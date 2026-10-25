import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { foodsReducer, isFoodsReducer } from "@/features/foods/states/reducer";
import { isTodayReducer, todayReducer } from "@/features/logs/states/reducer";
import { authUserReducer, isAuthLoadingReducer } from "@/features/auth/states/reducer";
import { glucoseReducer, statsReducer } from "@/features/health/states/reducer";

const rootReducer = combineReducers({
  foods: foodsReducer,
  isFoods: isFoodsReducer,
  today: todayReducer,
  isToday: isTodayReducer,
  authUser: authUserReducer,
  isAuthLoading: isAuthLoadingReducer,
  glucose: glucoseReducer,
  stats: statsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export const store = makeStore();
export type AppDispatch = typeof store.dispatch;
