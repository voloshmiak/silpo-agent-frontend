import { useState } from "react";
import { Header } from "@/widgets/header";
import { ProfilePage } from "@/pages/profile";
import { WeekPlanPage } from "@/pages/week-plan";
import { ArchivePage } from "@/pages/archive";
import { FeedbackPage } from "@/pages/feedback";

export function App() {
  const [currentTab, setCurrentTab] = useState("Тиждень");

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-zinc-900 flex flex-col font-sans">
      <Header activeTab={currentTab} onTabChange={setCurrentTab} />

      <main className="flex-1">
        {currentTab === "Профіль" && <ProfilePage />}
        {currentTab === "Тиждень" && <WeekPlanPage />}
        {currentTab === "Архів" && <ArchivePage />}
        {currentTab === "Фідбек" && <FeedbackPage />}
      </main>
    </div>
  );
}

export default App;