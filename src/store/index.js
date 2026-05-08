import { configureStore } from '@reduxjs/toolkit';

/**
 * Redux Toolkit store. Add slices to the `reducer` map as features land.
 * For persisted slices, wire `redux-persist` here (see elysium for a reference
 * pattern when auth/account state is added).
 */
export const store = configureStore({
  reducer: {
    // example: auth: authReducer,
  },
});

export default store;
