import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemPage from './pages/ProblemPage';
import { Toaster } from '@repo/ui/toaster';
import { VerifyOtp } from './pages/VerifyOtp';
import CompilerPage from './pages/CompilerPage';
import AdminLoginPage from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateContest from './pages/AdminCreateContest';
import AdminCreateProblem from './pages/AdminCreateProblem';
import AdminProblemDetail from './pages/AdminProblemDetail';
import AdminContestDetail from './pages/AdminContestDetail';
import ContestsPage from './pages/ContestsPage';
import ContestPage from './pages/ContestPage';
import { useAdminAuthentication, useAuthentication } from './hooks/useAuthentication';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GrindAI from './pages/GrindAI';
import { useEffect } from 'react';

function RequireAuth({ redirectTo = "/" }: { redirectTo?: string }) {
  const { authState } = useAuthentication();
  if (authState.loading) return <div className="p-4">Checking authentication…</div>;
  return authState.isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

function RequireAdminAuth({ redirectTo = "/" }: { redirectTo?: string }) {
  const { adminauthState } = useAdminAuthentication();
  if (adminauthState.loading) return <div className="p-4">Checking authentication…</div>;
  return adminauthState.isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
}


function App() {
  useEffect(()=>{
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  },[])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify" element={<VerifyOtp />} />
          <Route element={<RequireAuth redirectTo="/auth" />}>
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problem/:slug" element={<ProblemPage />} />
            <Route path="/compiler" element={<CompilerPage />} />
            <Route path="/contest" element={<ContestsPage />} />
            <Route path="/contest/:id" element={<ContestPage />} />
            <Route path="/grind-ai" element={<GrindAI />} />
            {/* <Route path="/grind-ai/:id" element={<GrindAIChat />} /> */}
          </Route>
          <Route path="/admin/auth" element={<AdminLoginPage />} />
          <Route element={<RequireAdminAuth redirectTo="/" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard/createcontest" element={<AdminCreateContest />} />
            <Route path="/admin/dashboard/createproblem" element={<AdminCreateProblem />} />
            <Route path="/admin/dashboard/contest/:id" element={<AdminContestDetail />} />
            <Route path="/admin/dashboard/problem/:id" element={<AdminProblemDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}


export default App
