import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../state/ReduxStateProvider";
import {
  setReduxProblems,
  setReduxSolvedProblems,
  setReduxContests,
  setUserAllChats,
  setUserDetails,
  setUserCreditDetails,
  setReduxCodeHistory,
} from "../state/ReduxStateProvider";
import { BACKENDURL, COMPILER_URL } from "../utils/urls";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";

/**
 * Centralized hook that fetches dashboard data once and caches it in Redux.
 * Subsequent calls skip the network request unless `refresh.<resource>()` is called.
 *
 * Usage:
 *   const { problems, contests, userChats, ... , refresh } = useDashboardData();
 */

type ResourceKey =
  | "problems"
  | "contests"
  | "userChats"
  | "userDetails"
  | "userCredits"
  | "codeHistory";

export function useDashboardData(resources: ResourceKey[] = []) {
  const dispatch = useDispatch<AppDispatch>();

  // ── selectors ───────────────────────────────────────────────────────
  const problemsState = useSelector((s: RootState) => s.problems);
  const contestsState = useSelector((s: RootState) => s.contests);
  const userChatsState = useSelector((s: RootState) => s.userAllChats);
  const userDetailsState = useSelector((s: RootState) => s.userDetails);
  const userCreditsState = useSelector((s: RootState) => s.userCreditDetails);
  const codeHistoryState = useSelector((s: RootState) => s.codeHistory);

  // Track in-flight requests to avoid duplicate concurrent fetches
  const inflightRef = useRef<Set<ResourceKey>>(new Set());

  // ── fetch helpers ───────────────────────────────────────────────────
  const authHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      token: localStorage.getItem("token") || "",
    }),
    [],
  );

  const fetchProblems = useCallback(async () => {
    if (inflightRef.current.has("problems")) return;
    inflightRef.current.add("problems");
    try {
      const response = await fetch(`${BACKENDURL}/problems/getproblems`, {
        method: "GET",
        headers: authHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        dispatch(setReduxProblems(json.problems));
        dispatch(setReduxSolvedProblems(json.solvedProblems || []));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch problems. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch problems.",
        variant: "destructive",
      });
    } finally {
      inflightRef.current.delete("problems");
    }
  }, [dispatch, authHeaders]);

  const fetchContests = useCallback(async () => {
    if (inflightRef.current.has("contests")) return;
    inflightRef.current.add("contests");
    try {
      const response = await fetch(`${BACKENDURL}/contest/getcontests`, {
        headers: authHeaders(),
      });
      const data = await response.json();
      if (response.ok && data?.success) {
        dispatch(setReduxContests(data.contests ?? []));
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to fetch contests.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch contests.",
        variant: "destructive",
      });
    } finally {
      inflightRef.current.delete("contests");
    }
  }, [dispatch, authHeaders]);

  const fetchUserChats = useCallback(async () => {
    if (inflightRef.current.has("userChats")) return;
    inflightRef.current.add("userChats");
    try {
      const response = await fetch(`${BACKENDURL}/grindai/get-chats`, {
        method: "GET",
        headers: authHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(setUserAllChats(data.chats));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch chat sessions.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch chat sessions.",
        variant: "destructive",
      });
    } finally {
      inflightRef.current.delete("userChats");
    }
  }, [dispatch, authHeaders]);

  const fetchUserDetails = useCallback(async () => {
    if (inflightRef.current.has("userDetails")) return;
    inflightRef.current.add("userDetails");
    try {
      const response = await fetch(`${BACKENDURL}/user/details`, {
        method: "GET",
        headers: authHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        dispatch(setUserDetails(json.user));
        // Also populate credit details from the same response
        if (json.user?.aitoken !== undefined) {
          dispatch(
            setUserCreditDetails({
              aicredit: json.user.aitoken,
              maxcredit: json.user.maxaitoken,
            }),
          );
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user details.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch user details.",
        variant: "destructive",
      });
    } finally {
      inflightRef.current.delete("userDetails");
    }
  }, [dispatch, authHeaders]);

  const fetchUserCredits = useCallback(async () => {
    // User credits are fetched as part of userDetails — just delegate
    await fetchUserDetails();
  }, [fetchUserDetails]);

  const fetchCodeHistory = useCallback(async () => {
    if (inflightRef.current.has("codeHistory")) return;
    inflightRef.current.add("codeHistory");
    try {
      const response = await fetch(
        `${COMPILER_URL}/compiler/get-code-history`,
        {
          method: "GET",
          headers: authHeaders(),
        },
      );
      if (response.ok) {
        const data = await response.json();
        dispatch(setReduxCodeHistory(data.history));
      } else {
        toast({
          title: "Error",
          description: "Could not fetch code history.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An error occurred while fetching code history.",
        variant: "destructive",
      });
    } finally {
      inflightRef.current.delete("codeHistory");
    }
  }, [dispatch, authHeaders]);

  // ── auto-fetch on mount if not cached ───────────────────────────────
  useEffect(() => {
    if (resources.includes("problems") && !problemsState.loaded) {
      fetchProblems();
    }
    if (resources.includes("contests") && !contestsState.loaded) {
      fetchContests();
    }
    if (resources.includes("userChats") && !userChatsState.loaded) {
      fetchUserChats();
    }
    if (resources.includes("userDetails") && !userDetailsState.loaded) {
      fetchUserDetails();
    }
    if (resources.includes("userCredits") && !userCreditsState.loaded) {
      fetchUserCredits();
    }
    if (resources.includes("codeHistory") && !codeHistoryState.loaded) {
      fetchCodeHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Data
    problems: problemsState.problems,
    solvedProblems: problemsState.solvedProblems,
    problemsLoaded: problemsState.loaded,
    contests: contestsState.contest,
    contestsLoaded: contestsState.loaded,
    userChats: userChatsState.allchats,
    userChatsLoaded: userChatsState.loaded,
    userDetails: userDetailsState.user,
    userDetailsLoaded: userDetailsState.loaded,
    userCredits: userCreditsState,
    userCreditsLoaded: userCreditsState.loaded,
    codeHistory: codeHistoryState.history,
    codeHistoryLoaded: codeHistoryState.loaded,

    // Force-refresh functions (for after mutations)
    refresh: {
      problems: fetchProblems,
      contests: fetchContests,
      userChats: fetchUserChats,
      userDetails: fetchUserDetails,
      userCredits: fetchUserCredits,
      codeHistory: fetchCodeHistory,
    },
  };
}
