import { createSlice, configureStore } from "@reduxjs/toolkit";

const User2FAAuthanticationSlice = createSlice({
  name: "User2FAAuthantication",
  initialState: {
    email: null as string | null, 
    challengeId : null as string | null
  },
  reducers: {
    setAuthData: (state, action) => {
      state.email = action.payload.email;
      state.challengeId = action.payload.challengeId;
    },
  },
});

export const { setAuthData } = User2FAAuthanticationSlice.actions;

export const store = configureStore({
  reducer: {
    user2FAAuthantication: User2FAAuthanticationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;