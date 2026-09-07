import { useEffect, useState } from "react";
import { userApi } from "@/entities/user/api/userApi";
import { Header } from "@/widgets/header";
import { ProfilePage } from "@/pages/profile";
import { WeekPlanPage } from "@/pages/week-plan";
import { ArchivePage } from "@/pages/archive";
import { FeedbackPage } from "@/pages/feedback";

export function App() {
  const [currentTab, setCurrentTab] = useState("Тиждень");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Получаем или создаем юзера при старте
    userApi.initUser("Денис")
      .then((user) => {
        console.log("Авторизовано юзера:", user.id);
        setIsReady(true);
      })
      .catch((err) => {
        console.error("Помилка авторизації:", err);
        setIsReady(true);
      });
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#F4F1E8] flex items-center justify-center font-mono text-sm">
        Ініціалізація SILPOFIT...
      </div>
    );
  }
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