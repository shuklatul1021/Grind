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

const UserDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: {
      user : {} 
    },
    reducers: {
        setUserDetails: (state, action) => {
          state.user = action.payload;
        }
    }
});

const ProblemsSlice = createSlice({
    name: 'problems',
    initialState: {
      problems : []
    },
    reducers: {
        setReduxProblems: (state, action) => {
          state.problems = action.payload;
        }
    }
});

const ContestSlice = createSlice({
    name: 'contests',
    initialState: {
      contest : []
    },
    reducers: {
        setReduxContests: (state, action) => {
          state.contest = action.payload;
        }
    }
});

export const { setUserDetails } = UserDetailsSlice.actions;
export const { setReduxProblems } = ProblemsSlice.actions;
export const { setReduxContests } = ContestSlice.actions;
export const { setAuthData } = User2FAAuthanticationSlice.actions;

export const store = configureStore({
  reducer: {
    userDetails: UserDetailsSlice.reducer,
    problems: ProblemsSlice.reducer,
    contests: ContestSlice.reducer,
    user2FAAuthantication: User2FAAuthanticationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;