import { atom } from "recoil";
import type { Problem } from "../types/problem";
import type { Contest } from "../pages/AdminDashboard";


export const ProblemState = atom<Problem[]>({
    key : "ProblemState",
    default : []
})

export const ContestState = atom<Contest[]>({
    key : "ContestState",
    default : []
})

export const ChallengeId = atom({
    key : "challengeId",
    default : ""
})