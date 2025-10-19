import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemPage from './pages/ProblemPage';
import { Toaster } from '@repo/ui/toaster';
import { VerifyOtp } from './pages/VerifyOtp';
import CompilerPage from './pages/CompilerPage';
import ContestPage from './pages/ContestPage';
import AdminLoginPage from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateContest from './pages/AdminCreateContest';
import AdminCreateProblem from './pages/AdminCreateProblem';
import AdminProblemDetail from './pages/AdminProblemDetail';
import AdminContestDetail from './pages/AdminContestDetail';
import { useAuthentication } from './hooks/useAuthentication';

function App() {
  const { isAuthenticated } = useAuthentication();
  return (
    <>
      <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/verify" element={<VerifyOtp />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problem/:slug" element={<ProblemPage />} />
              <Route path="/compiler" element={<CompilerPage />} />
              <Route path="/contest" element={<ContestPage />} />
              <Route path="/admin/auth" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/dashboard/createcontest" element={<AdminCreateContest />} />
              <Route path="/admin/dashboard/createproblem" element={<AdminCreateProblem />} />
              <Route path="/admin/dashboard/contest/:id" element={<AdminContestDetail />} />
              <Route path="/admin/dashboard/problem/:id" element={<AdminProblemDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
      </ThemeProvider>
    </>
  )
}

export default App
