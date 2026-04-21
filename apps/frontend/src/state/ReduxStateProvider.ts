import { createSlice, configureStore } from "@reduxjs/toolkit";
import type { UserInterface } from "../types/problem";
import type { ContestSummary } from "../types/contest";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}

const User2FAAuthanticationSlice = createSlice({
  name: "User2FAAuthantication",
  initialState: {
    email: null as string | null,
    challengeId: null as string | null,
  },
  reducers: {
    setAuthData: (state, action) => {
      state.email = action.payload.email;
      state.challengeId = action.payload.challengeId;
    },
  },
});

const userCreditDetailsSlice = createSlice({
  name: "userCreditDetails",
  initialState: {
    aicredit: 0,
    maxcredit: 0,
    loaded: false,
  },
  reducers: {
    setUserCreditDetails: (state, action) => {
      state.aicredit = action.payload.aicredit;
      state.maxcredit = action.payload.maxcredit;
      state.loaded = true;
    },
  },
});

const UserDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    user: {
      id: "",
      username: "",
      fullname: "",
      email: "",
      bio: "",
      avatar: "",
      location: "",
      problemsSolved: 0,
      rank: 0,
      contestsParticipated: 0,
      currentStreak: 0,
      social: { id: "", github: "", linkedin: "", twitter: "" },
      createdAt: undefined,
      propr: "",
    } as UserInterface,
    loaded: false,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
        social: {
          ...state.user.social,
          ...(action.payload.social ?? {}),
        },
      };
      state.loaded = true;
    },
  },
});

const UserAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: true,
  } as AuthState,
  reducers: {
    setUserAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.loading = action.payload.loading;
    },
  },
});

const ProblemsSlice = createSlice({
  name: "problems",
  initialState: {
    problems: [] as any[],
    solvedProblems: [] as string[],
    loaded: false,
  },
  reducers: {
    setReduxProblems: (state, action) => {
      state.problems = action.payload;
      state.loaded = true;
    },
    setReduxSolvedProblems: (state, action) => {
      state.solvedProblems = action.payload;
    },
  },
});

const ContestSlice = createSlice({
  name: "contests",
  initialState: {
    contest: [] as ContestSummary[],
    loaded: false,
  },
  reducers: {
    setReduxContests: (state, action) => {
      state.contest = action.payload;
      state.loaded = true;
    },
  },
});

const UserPromptSlice = createSlice({
  name: "userPrompts",
  initialState: {
    prompt: null as string | null,
  },
  reducers: {
    setUserPrompt: (state, action) => {
      state.prompt = action.payload.prompt;
    },
  },
});

const UserAllChatSlice = createSlice({
  name: "userAllChats",
  initialState: {
    allchats: [] as any[],
    loaded: false,
  },
  reducers: {
    setUserAllChats: (state, action) => {
      state.allchats = action.payload;
      state.loaded = true;
    },
  },
});

const IsUserFirstChatSlice = createSlice({
  name: "isUserFirstChat",
  initialState: {
    isFirstChat: false,
  },
  reducers: {
    setIsUserFirstChat: (state, action) => {
      state.isFirstChat = action.payload;
    },
  },
});

const CodeHistorySlice = createSlice({
  name: "codeHistory",
  initialState: {
    history: [] as any[],
    loaded: false,
  },
  reducers: {
    setReduxCodeHistory: (state, action) => {
      state.history = action.payload;
      state.loaded = true;
    },
  },
});

export const { setUserDetails } = UserDetailsSlice.actions;
export const { setUserAuthState } = UserAuthSlice.actions;
export const { setReduxProblems, setReduxSolvedProblems } = ProblemsSlice.actions;
export const { setReduxContests } = ContestSlice.actions;
export const { setAuthData } = User2FAAuthanticationSlice.actions;
export const { setUserPrompt } = UserPromptSlice.actions;
export const { setUserCreditDetails } = userCreditDetailsSlice.actions;
export const { setUserAllChats } = UserAllChatSlice.actions;
export const { setIsUserFirstChat } = IsUserFirstChatSlice.actions;
export const { setReduxCodeHistory } = CodeHistorySlice.actions;

export const store = configureStore({
  reducer: {
    userAuth: UserAuthSlice.reducer,
    userDetails: UserDetailsSlice.reducer,
    problems: ProblemsSlice.reducer,
    contests: ContestSlice.reducer,
    user2FAAuthantication: User2FAAuthanticationSlice.reducer,
    userPrompts: UserPromptSlice.reducer,
    userCreditDetails: userCreditDetailsSlice.reducer,
    userAllChats: UserAllChatSlice.reducer,
    isUserFirstChat: IsUserFirstChatSlice.reducer,
    codeHistory: CodeHistorySlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
