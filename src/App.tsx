import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";

// Pages
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Workflows from "@/pages/Workflows";
import Statistics from "@/pages/Statistics";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import AIAssistant from "@/pages/AIAssistant";
import About from "@/pages/About";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="about" element={<About />} />
          <Route path="team" element={<Tasks />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
