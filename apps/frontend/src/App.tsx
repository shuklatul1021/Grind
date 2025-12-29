import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import { Toaster } from "@repo/ui/toaster";
import { VerifyOtp } from "./pages/VerifyOtp";
import CompilerPage from "./pages/CompilerPage";
import AdminLoginPage from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateContest from "./pages/AdminCreateContest";
import AdminCreateProblem from "./pages/AdminCreateProblem";
import AdminProblemDetail from "./pages/AdminProblemDetail";
import AdminContestDetail from "./pages/AdminContestDetail";
import ContestsPage from "./pages/ContestsPage";
import ContestPage from "./pages/ContestPage";
import {
  useAdminAuthentication,
  useAuthentication,
} from "./hooks/useAuthentication";
import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GrindAI from "./pages/GrindAI";
import { useEffect } from "react";
import ProfilePage from "./pages/ProfilePage";
import GrindAIChat from "./pages/GrindAIChat";
import PricingPage from "./pages/PricingPage";
import CancellationRefunds from "./pages/CancellationRefunds";
import ShippingPolicy from "./pages/ShippingPolicy";
import ContactUs from "./pages/ContactUs";
import PremiumZone from "./pages/PremiumPage";
import NotFound from "./pages/Not-Found";
// import LearningPage from "./Learning/Learning";
// import QuizPage from "./Learning/PracticeZone/Apptitude/Quiz";
// import InterviewWorkspace from "./pages/InterviewPage";
// import HrRoundPage from "./pages/HRRoundPage";
// import PracticePage from "./Learning/PracticeZone/PracticePage";
// import InterviewPreparationPage from "./Learning/InterviewPreparation/InterviewPreparation";
// import ConceptLearningPage from "./Learning/ConceptLearning/ConceptLearning";
// import CareerGrowthPage from "./Learning/CareerGrowth/CareerGrowth";
// import ApptitudeSyllabus from "./Learning/PracticeZone/Apptitude/ApptitudeSyllabus";
// import CodingPracticeSyllabus from "./Learning/PracticeZone/CodingPractice/CodingPracticeSyllabus";
// import DSASyllabus from "./Learning/PracticeZone/DSA/DSA-Syllabus";
// import LogicalReasoningSyllabus from "./Learning/PracticeZone/LogicalReasoning/LogicalReasoningSyllabus";
// import CodingPracticesEditorPage from "./Learning/PracticeZone/CodingPractice/CodingPracticesWorkspace";

function RequireAuth({ redirectTo = "/" }: { redirectTo?: string }) {
  const { authState } = useAuthentication();
  if (authState.loading)
    return <div className="p-4">Checking authentication…</div>;
  return authState.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace />
  );
}

function RequireAdminAuth({ redirectTo = "/" }: { redirectTo?: string }) {
  const { adminauthState } = useAdminAuthentication();
  if (adminauthState.loading)
    return <div className="p-4">Checking Admin authentication…</div>;
  return adminauthState.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace />
  );
}

function App() {
  useEffect(()=>{
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  },[])
  

  console.log(
    "%c⚠️ SECURITY WARNING ⚠️\n" +
      "This console is for developers only. If someone told you to paste code here, it's a SCAM!\n" +
      "Attackers can steal:\n" +
      "• Your account and passwords\n" +
      "• Your personal data\n" +
      "• Your payment information\n" +
      " Do NOT paste any code here unless you know exactly what it does!",
    "color: #ffffff; background: #000000; font-size: 1.2em; font-weight: bold; line-height: 1.8; padding: 10px;"
  );

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/cancellation-policy"
            element={<CancellationRefunds />}
          />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify" element={<VerifyOtp />} />
          <Route element={<RequireAuth redirectTo="/auth" />}>
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problem/:slug" element={<ProblemPage />} />
            <Route path="/compiler" element={<CompilerPage />} />
            <Route path="/contest" element={<ContestsPage />} />
            <Route path="/contest/:id" element={<ContestPage />} />
            <Route path="/grind-ai" element={<GrindAI />} />

            {/* Learning Routes */}
            {/* <Route path="/learning" element={<LearningPage />} /> */}
              {/* Learning Practice */}
                {/* <Route path="/learning/practice" element={<PracticePage />} />
                <Route path="/learning/practice/aptitude" element={<ApptitudeSyllabus />} />
                <Route path="/learning/practice/aptitude/topic" element={<QuizPage />} /> */}

              {/* Coding Practice Syllabus */}
                {/* <Route path="/learning/practice/coding" element={<CodingPracticeSyllabus />} />
                <Route path="/learning/practice/coding/:slug" element={<CodingPracticesEditorPage />} /> */}

              {/* DSA Syllabus */}
                {/* <Route path="/learning/practice/dsa" element={<DSASyllabus />} /> */}

              {/* Logical Reasoning Syllabus */}
                {/* <Route path="/learning/practice/logical-reasoning" element={<LogicalReasoningSyllabus />} /> */}


            {/* Learning Interview Preparation */}
            {/* <Route path="/learning/interview" element={<InterviewPreparationPage />} /> */}
            {/* Learning Concepts */}
            {/* <Route path="/learning/concepts" element={<ConceptLearningPage />} /> */}
            {/* Learning Career Growth */}
            {/* <Route path="/learning/career" element={<CareerGrowthPage />} /> */}


            {/* <Route path="/learning/quiz" element={<QuizPage />} />
            <Route path="/learning/interview" element={<InterviewWorkspace />} />
            <Route path="/learning/hr" element={<HrRoundPage />} /> */}

            <Route path="/premium/pricing" element={<PricingPage />} />
            <Route path="/premium" element={<PremiumZone />} />
            {/* <Route path="/room" element={<RoomsPage />} /> */}
            <Route path="/you" element={<ProfilePage />} />
            <Route path="/grind-ai/c/:id" element={<GrindAIChat />} />
          </Route>
          <Route path="/admin/auth" element={<AdminLoginPage />} />
          <Route element={<RequireAdminAuth redirectTo="/" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/dashboard/createcontest"
              element={<AdminCreateContest />}
            />
            <Route
              path="/admin/dashboard/createproblem"
              element={<AdminCreateProblem />}
            />
            <Route
              path="/admin/dashboard/contest/:id"
              element={<AdminContestDetail />}
            />
            <Route
              path="/admin/dashboard/problem/:id"
              element={<AdminProblemDetail />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
