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

function App() {

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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
      </ThemeProvider>
    </>
  )
}

export default App
