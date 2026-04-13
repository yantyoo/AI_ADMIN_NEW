import { useEffect, useState } from "react";
import { AuthScreen } from "./components/auth-screen";
import { AUTH_STAGE_KEY } from "@/features/layout/session";
import { DashboardShell } from "./components/dashboard";

type AppRoute =
  | "/dashboard"
  | "/content"
  | "/cache-qa"
  | "/knowledge"
  | "/feedback"
  | "/accounts";

const AUTHENTICATED_STAGE = "authenticated";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentPath, setCurrentPath] = useState<AppRoute>("/dashboard");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setAuthenticated(window.sessionStorage.getItem(AUTH_STAGE_KEY) === AUTHENTICATED_STAGE);
  }, []);

  const handleAuthenticated = () => {
    setAuthenticated(true);
    setCurrentPath("/dashboard");
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentPath("/dashboard");
  };

  if (!authenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <DashboardShell
      currentPath={currentPath}
      onNavigate={setCurrentPath}
      onLogout={handleLogout}
    />
  );
}
