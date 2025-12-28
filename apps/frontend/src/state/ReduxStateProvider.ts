import { createSlice, configureStore } from "@reduxjs/toolkit";
import type { UserInterface } from "../types/problem";

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
  },
  reducers: {
    setUserCreditDetails: (state, action) => {
      state.aicredit = action.payload.aicredit;
      state.maxcredit = action.payload.maxcredit;
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
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
  },
});

const ProblemsSlice = createSlice({
  name: "problems",
  initialState: {
    problems: [],
  },
  reducers: {
    setReduxProblems: (state, action) => {
      state.problems = action.payload;
    },
  },
});

const ContestSlice = createSlice({
  name: "contests",
  initialState: {
    contest: [],
  },
  reducers: {
    setReduxContests: (state, action) => {
      state.contest = action.payload;
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
  },
  reducers: {
    setUserAllChats: (state, action) => {
      state.allchats = action.payload;
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

export const { setUserDetails } = UserDetailsSlice.actions;
export const { setReduxProblems } = ProblemsSlice.actions;
export const { setReduxContests } = ContestSlice.actions;
export const { setAuthData } = User2FAAuthanticationSlice.actions;
export const { setUserPrompt } = UserPromptSlice.actions;
export const { setUserCreditDetails } = userCreditDetailsSlice.actions;
export const { setUserAllChats } = UserAllChatSlice.actions;
export const { setIsUserFirstChat } = IsUserFirstChatSlice.actions;

export const store = configureStore({
  reducer: {
    userDetails: UserDetailsSlice.reducer,
    problems: ProblemsSlice.reducer,
    contests: ContestSlice.reducer,
    user2FAAuthantication: User2FAAuthanticationSlice.reducer,
    userPrompts: UserPromptSlice.reducer,
    userCreditDetails: userCreditDetailsSlice.reducer,
    userAllChats: UserAllChatSlice.reducer,
    isUserFirstChat: IsUserFirstChatSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
