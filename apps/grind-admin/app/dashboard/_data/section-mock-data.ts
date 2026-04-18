import type { DashboardSectionContent } from "../_components/mock-section-page";

export const SECTION_MOCK_DATA: Record<string, DashboardSectionContent> = {
  "user-activity": {
    title: "User Activity",
    description:
      "Mock feed of admin-observed user behavior and platform engagement trends.",
    metrics: [
      { label: "Daily Active Users", value: "1,284", note: "+11.3% this week" },
      { label: "Avg Session Time", value: "18m", note: "+2m from last week" },
      { label: "New Signups", value: "96", note: "Stable growth" },
    ],
    columns: ["Event", "User", "Time", "Status"],
    rows: [
      ["Solved 5 problems", "ananya_92", "2m ago", "Completed"],
      ["Started daily challenge", "raj_dev", "8m ago", "In Progress"],
      ["Reported issue", "mihir_code", "14m ago", "Open"],
      ["Contest registration", "sparsh_ai", "22m ago", "Completed"],
    ],
  },
  "problem-bank": {
    title: "Problem Bank",
    description:
      "Mock inventory of coding problems grouped for curation and review.",
    metrics: [
      { label: "Total Problems", value: "526", note: "+14 this month" },
      { label: "Needs Review", value: "31", note: "Editorial pending" },
      { label: "Archived", value: "44", note: "Low engagement set" },
    ],
    columns: ["Problem", "Category", "Updated", "Status"],
    rows: [
      ["Sliding Window Median", "Heap", "Today", "Draft"],
      ["Shortest Path Grid", "Graph", "Yesterday", "Published"],
      ["Merge K Lists", "Linked List", "2 days ago", "Review"],
      ["Trie Prefix Count", "Trie", "3 days ago", "Archived"],
    ],
  },
  "admin-team": {
    title: "Admin Team",
    description:
      "Mock operational board for admin workload, ownership, and throughput.",
    metrics: [
      { label: "Active Admins", value: "12", note: "2 on leave" },
      { label: "Pending Tasks", value: "47", note: "Across 4 queues" },
      { label: "Resolved Today", value: "29", note: "Strong pace" },
    ],
    columns: ["Admin", "Queue", "Last Action", "Status"],
    rows: [
      ["Aditi Sharma", "Problem Review", "5m ago", "Online"],
      ["Rohan Gupta", "Moderation", "17m ago", "Online"],
      ["Nisha Verma", "Contest Ops", "42m ago", "Away"],
      ["Karan S", "User Reports", "1h ago", "Online"],
    ],
  },
  "problem-drafts": {
    title: "Problem Drafts",
    description:
      "Mock draft list for newly authored problems awaiting final QA.",
    metrics: [
      { label: "Drafts", value: "18", note: "8 created this week" },
      { label: "Editorial Ready", value: "6", note: "Ready to publish" },
      { label: "Blocked", value: "3", note: "Missing test data" },
    ],
    columns: ["Draft", "Author", "Updated", "Status"],
    rows: [
      ["Balanced Split Array", "Neha", "Today", "In Review"],
      ["Cycle Edge Detector", "Arun", "Yesterday", "Blocked"],
      ["Top K Stream", "Ravi", "2 days ago", "Ready"],
      ["String Flip Cost", "Meera", "3 days ago", "In Review"],
    ],
  },
  "moderation-reports": {
    title: "Moderation Reports",
    description:
      "Mock moderation queue for flagged users, plagiarism, and abuse signals.",
    metrics: [
      { label: "Open Reports", value: "17", note: "-9% since yesterday" },
      {
        label: "Critical",
        value: "2",
        note: "Requires immediate review",
      },
      { label: "Auto-Closed", value: "11", note: "Bot-assisted triage" },
    ],
    columns: ["Report", "Target", "Raised", "Status"],
    rows: [
      ["Possible plagiarism", "user_442", "9m ago", "Open"],
      ["Spam links", "user_130", "27m ago", "Investigating"],
      ["Harassment claim", "user_992", "1h ago", "Critical"],
      ["Contest cheating", "team_delta", "3h ago", "Resolved"],
    ],
  },
  guidelines: {
    title: "Guidelines",
    description:
      "Mock content governance checklist for authoring, moderation, and release.",
    metrics: [
      { label: "Active Policies", value: "23", note: "Version 4.2" },
      {
        label: "Updated This Month",
        value: "5",
        note: "Contest policy revised",
      },
      { label: "Pending Review", value: "4", note: "Editorial committee" },
    ],
    columns: ["Guideline", "Owner", "Version", "Status"],
    rows: [
      ["Problem quality rubric", "Content Team", "v2.1", "Active"],
      ["Abuse escalation", "Moderation", "v1.8", "Active"],
      ["Contest fairness", "Ops", "v3.0", "Review"],
      ["AI usage policy", "Legal", "v1.2", "Draft"],
    ],
  },
  settings: {
    title: "Settings",
    description:
      "Mock control center for admin preferences and platform operations toggles.",
    metrics: [
      { label: "Feature Flags", value: "34", note: "6 enabled for beta" },
      { label: "System Alerts", value: "3", note: "1 high priority" },
      { label: "Connected Services", value: "9", note: "All healthy" },
    ],
    columns: ["Setting", "Scope", "Updated", "Status"],
    rows: [
      ["Auto-review threshold", "Moderation", "Today", "Enabled"],
      ["Draft auto-save", "Problems", "Yesterday", "Enabled"],
      ["Contest lock window", "Contests", "2 days ago", "Disabled"],
      ["Telemetry export", "Platform", "5 days ago", "Enabled"],
    ],
  },
  help: {
    title: "Get Help",
    description:
      "Mock internal help desk for admin support, incidents, and runbooks.",
    metrics: [
      { label: "Open Tickets", value: "12", note: "Avg response 18m" },
      { label: "Resolved Today", value: "21", note: "SLA on track" },
      { label: "Runbooks", value: "37", note: "3 updated this week" },
    ],
    columns: ["Ticket", "Owner", "Opened", "Status"],
    rows: [
      ["Login issue on admin panel", "Support", "11m ago", "Open"],
      ["Contest publish failed", "Platform", "31m ago", "Working"],
      ["Missing test case export", "Content", "1h ago", "Open"],
      ["Rate limit confusion", "Support", "2h ago", "Resolved"],
    ],
  },
  search: {
    title: "Search",
    description:
      "Mock global search index snapshot for users, problems, contests, and reports.",
    metrics: [
      { label: "Indexed Records", value: "48.2k", note: "Synced 4m ago" },
      { label: "Query Latency", value: "42ms", note: "P95 healthy" },
      { label: "Saved Filters", value: "19", note: "Team-wide presets" },
    ],
    columns: ["Query", "Scope", "Last Used", "Status"],
    rows: [
      ["difficulty:hard tag:graph", "Problems", "Today", "Saved"],
      ["status:open type:report", "Moderation", "Today", "Saved"],
      ["contest:weekly season:april", "Contests", "Yesterday", "Active"],
      ["user:raj_dev warnings", "Users", "2 days ago", "Saved"],
    ],
  },
};
