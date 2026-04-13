import { useEffect, useMemo, useState } from "react";
import { DashboardPanel } from "@/features/dashboard/dashboard-panel";
import { ContentPanel } from "@/features/content/content-panel";
import { CacheQaPanel } from "@/features/cache-qa/cache-qa-panel";
import { KnowledgePanel } from "@/features/knowledge/knowledge-panel";
import { FeedbackPanel } from "@/features/feedback/feedback-panel";
import { AccountsPanel } from "@/features/accounts/accounts-panel";
import { navItems, pageMetaByPath } from "@/features/layout/config";
import { readStoredAuthProfile } from "@/features/layout/session";
import { dashboardMockByRange } from "@/api/dashboard";
import { contentDocumentsSeed } from "@/api/content";
import { cacheQaSeed } from "@/api/cache-qa";
import { getFeedbacks } from "@/api/feedback";
import { getAccountsData } from "@/api/accounts";
import { getKnowledgeInitialData } from "@/api/knowledge";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

type AppRoute =
  | "/dashboard"
  | "/content"
  | "/cache-qa"
  | "/knowledge"
  | "/feedback"
  | "/accounts";

type DashboardShellProps = {
  currentPath: AppRoute;
  onNavigate: (path: AppRoute) => void;
  onLogout: () => void;
};

type ShellData = {
  feedbacks: Awaited<ReturnType<typeof getFeedbacks>>;
  accounts: Awaited<ReturnType<typeof getAccountsData>>["accounts"];
  knowledgeDocuments: Awaited<ReturnType<typeof getKnowledgeInitialData>>["documents"];
};

export function DashboardShell({ currentPath, onNavigate, onLogout }: DashboardShellProps) {
  const currentUser = readStoredAuthProfile();
  const pageMeta = pageMetaByPath[currentPath] ?? pageMetaByPath["/dashboard"];
  const visibleRoutes = useMemo(
    () => navItems.filter((item) => item.roles.includes(currentUser.role)).map((item) => item.href as AppRoute),
    [currentUser.role]
  );
  const [data, setData] = useState<ShellData | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([getFeedbacks(), getAccountsData(), getKnowledgeInitialData()]).then(
      ([feedbacks, accountsData, knowledgeData]) => {
        if (!active) {
          return;
        }

        setData({
          feedbacks,
          accounts: accountsData.accounts,
          knowledgeDocuments: knowledgeData.documents
        });
      }
    );

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (visibleRoutes.includes(currentPath)) {
      return;
    }

    if (visibleRoutes[0]) {
      onNavigate(visibleRoutes[0]);
    }
  }, [currentPath, onNavigate, visibleRoutes]);

  const renderRoute = () => {
    switch (currentPath) {
      case "/dashboard":
        return <DashboardPanel data={dashboardMockByRange.WEEK} />;
      case "/content":
        return <ContentPanel documents={contentDocumentsSeed} />;
      case "/cache-qa":
        return <CacheQaPanel items={cacheQaSeed} />;
      case "/knowledge":
        return data ? <KnowledgePanel documents={data.knowledgeDocuments} /> : <LoadingPane label="지식 기반 조회" />;
      case "/feedback":
        return data ? <FeedbackPanel feedbacks={data.feedbacks} /> : <LoadingPane label="피드백 관리" />;
      case "/accounts":
        return data ? <AccountsPanel accounts={data.accounts} /> : <LoadingPane label="계정/권한 관리" />;
      default:
        return <DashboardPanel data={dashboardMockByRange.WEEK} />;
    }
  };

  return (
    <div className="admin-shell">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="admin-shell__main">
        <TopHeader
          title={pageMeta.title}
          description={pageMeta.description}
          rightSlot={
            <div className="top-header__user">
              <div className="top-header__user-name">{currentUser.name}</div>
              <div className="top-header__user-role">{currentUser.role}</div>
            </div>
          }
        />
        <main className="admin-shell__content">{renderRoute()}</main>
      </div>
    </div>
  );
}

function LoadingPane({ label }: { label: string }) {
  return (
    <section className="panel panel--main">
      <div className="content-empty content-empty--detail">{label} 데이터를 불러오는 중입니다.</div>
    </section>
  );
}
