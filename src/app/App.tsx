import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { Header } from "@/widgets/header";
import { ProfilePage } from "@/pages/profile";
import { WeekPlanPage } from "@/pages/week-plan";
import { ArchivePage } from "@/pages/archive";
import { FeedbackPage } from "@/pages/feedback";
import { OnboardingPage } from "@/pages/onboarding";
import { useAuthUser } from "@/entities/user";
import type { PlanData } from "@/entities/plan";

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  // Єдина точка авторизації: хук робить GET /users/me, тож викликаємо його
  // тут один раз і передаємо результат униз, а не смикаємо в кожному екрані
  const { user, isAuthenticated, isLoading, registerUser, logout } = useAuthUser();
  const [isOnboardingGenerating, setIsOnboardingGenerating] = useState(false);

  // Доки не знаємо, чи є валідний JWT, не можна вирішувати, куди пускати
  if (isLoading) {
    return <div className="min-h-screen bg-[#F4F1E8]" />;
  }

  return (
    <Routes>
      <Route
        path="/onboarding"
        element={
          isAuthenticated && !isOnboardingGenerating ? (
            <Navigate to="/week" replace />
          ) : (
            <OnboardingRoute
              registerUser={registerUser}
              onGenerationStarted={() => setIsOnboardingGenerating(true)}
              onComplete={() => setIsOnboardingGenerating(false)}
            />
          )
        }
      />

      <Route
        element={
          isAuthenticated ? (
            <AppLayout userName={user?.name ?? ""} onLogout={logout} />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      >
        <Route path="/week" element={<WeekRoute />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/week" replace />} />
    </Routes>
  );
}

function AppLayout({
  userName,
  onLogout,
}: {
  userName: string;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-zinc-900 flex flex-col font-sans">
      <Header
        userName={userName}
        onLogout={() => {
          onLogout();
          navigate("/onboarding", { replace: true });
        }}
      />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function OnboardingRoute({
  registerUser,
  onGenerationStarted,
  onComplete,
}: {
  registerUser: (name: string) => Promise<unknown>;
  onGenerationStarted: () => void;
  onComplete: (plan: PlanData) => void;
}) {
  const navigate = useNavigate();

  // Свіжозгенерований план передаємо через history state, щоб «Тиждень»
  // намалював його одразу, не чекаючи на GET /plans
  return (
    <OnboardingPage
      registerUser={registerUser}
      onGenerationStarted={onGenerationStarted}
      onComplete={(plan) => {
        onComplete(plan);
        navigate("/week", { replace: true, state: { plan } });
      }}
    />
  );
}

function WeekRoute() {
  const location = useLocation();
  const plan = (location.state as { plan?: PlanData } | null)?.plan ?? null;

  return <WeekPlanPage initialPlan={plan} />;
}

export default App;
