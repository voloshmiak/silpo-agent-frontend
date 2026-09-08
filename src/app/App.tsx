import { useState } from "react";
import { Header } from "@/widgets/header";
import { ProfilePage } from "@/pages/profile";
import { WeekPlanPage } from "@/pages/week-plan";
import { ArchivePage } from "@/pages/archive";
import { FeedbackPage } from "@/pages/feedback";
import { OnboardingPage } from "@/pages/onboarding";
import { useAuthUser } from "@/entities/user";
import type { ParsedPlanContent } from "@/entities/plan";

export function App() {
  const [currentTab, setCurrentTab] = useState("Тиждень");
  const [generatedPlan, setGeneratedPlan] = useState<ParsedPlanContent | null>(null);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const { isAuthenticated, isLoading } = useAuthUser();

  if (isLoading) {
    return <div className="min-h-screen bg-[#F4F1E8]" />;
  }

  if (!isAuthenticated && !onboardingDone) {
    return (
      <OnboardingPage
        onComplete={(plan) => {
          setGeneratedPlan(plan);
          setOnboardingDone(true);
          setCurrentTab("Тиждень");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-zinc-900 flex flex-col font-sans">
      <Header activeTab={currentTab} onTabChange={setCurrentTab} />

      <main className="flex-1">
        {currentTab === "Профіль" && <ProfilePage />}
        {currentTab === "Тиждень" && <WeekPlanPage initialPlan={generatedPlan} />}
        {currentTab === "Архів" && <ArchivePage />}
        {currentTab === "Фідбек" && <FeedbackPage />}
      </main>
    </div>
  );
}

export default App;
