import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { MobileBottomNav } from "../components/layout/MobileBottomNav.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { Topbar } from "../components/layout/Topbar.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { useTheme } from "../hooks/useTheme.js";

export const AppShell = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const dashboardData = useDashboardData(user);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToDestination = (destination) => {
    if (!destination) {
      return;
    }

    if (destination.startsWith("/")) {
      navigate(destination);
      return;
    }

    const element = document.getElementById(destination);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden p-4 pb-24 text-slate-100 md:p-6 md:pb-6">
      <div className="blob left-[-40px] top-8 h-44 w-44 bg-sky-400/30" />
      <div className="blob right-0 top-24 h-56 w-56 bg-fuchsia-500/25" />
      <div className="blob bottom-0 left-1/3 h-48 w-48 bg-cyan-400/25" />
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <Sidebar activePath={location.pathname} onNavigate={navigateToDestination} />
        <motion.main
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex-1 space-y-6"
        >
          <Topbar
            theme={theme}
            setTheme={setTheme}
            toggleTheme={toggleTheme}
            notifications={dashboardData.notifications}
            user={user}
            teacher={dashboardData.teacher}
            courses={dashboardData.courses}
            graph={dashboardData.graph}
            onLogout={logout}
            onNavigate={navigateToDestination}
            onMarkNotificationRead={dashboardData.markNotificationRead}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <Outlet
                context={{
                  ...dashboardData,
                  currentPath: location.pathname,
                  navigateToSection: navigateToDestination
                }}
              />
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
      <MobileBottomNav activePath={location.pathname} onNavigate={navigateToDestination} />
    </div>
  );
};
