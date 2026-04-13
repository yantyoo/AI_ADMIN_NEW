import { useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { navItems } from "@/features/layout/config";
import { clearAuthProfile, readStoredAuthProfile } from "@/features/layout/session";

const AUTH_STAGE_KEY = "xperp-mock-auth-stage";
const AUTH_AUTHENTICATED_KEY = "xperp-mock-authenticated";
const AUTH_USER_KEY = "xperp-mock-auth-user";
const AUTH_OTP_FAILURES_KEY = "xperp-mock-otp-failures";
const AUTH_OTP_LOCKED_KEY = "xperp-mock-otp-locked";

type SidebarProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
};

export function Sidebar({ currentPath, onNavigate, onLogout }: SidebarProps) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const currentUser = readStoredAuthProfile();
  const visibleItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(AUTH_STAGE_KEY);
      window.sessionStorage.removeItem(AUTH_AUTHENTICATED_KEY);
      window.sessionStorage.removeItem(AUTH_USER_KEY);
      window.sessionStorage.removeItem(AUTH_OTP_FAILURES_KEY);
      window.sessionStorage.removeItem(AUTH_OTP_LOCKED_KEY);
      window.localStorage.removeItem(AUTH_AUTHENTICATED_KEY);
    }

    clearAuthProfile();
    setLogoutOpen(false);
    onLogout();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">XpERP</div>
        <div className="sidebar__badge">AI 관리자로</div>
      </div>

      <nav className="sidebar__nav" aria-label="메뉴">
        {visibleItems.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <button
              key={item.key}
              type="button"
              className={`sidebar__nav-item${isActive ? " is-active" : ""}`}
              onClick={() => onNavigate(item.href)}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="sidebar__nav-icon" aria-hidden="true">
                {item.key.slice(0, 1).toUpperCase()}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar__user">
        <div className="sidebar__user-row">
          <div className="sidebar__user-name">{currentUser.name}</div>
          <div className="sidebar__user-meta">{currentUser.id}</div>
        </div>
        <div className="sidebar__user-role">
          {currentUser.role} · {currentUser.department}
        </div>
        <button
          type="button"
          className="secondary-button sidebar__logout"
          onClick={() => setLogoutOpen(true)}
        >
          로그아웃
        </button>
      </div>

      {logoutOpen ? (
        <ModalDialog
          title="로그아웃"
          ariaLabel="로그아웃 확인"
          onClose={() => setLogoutOpen(false)}
          size="sm"
          compact
          backdropClassName="logout-backdrop"
          headerClassName="modal__header--tight"
          footerClassName="modal__footer--split"
          footer={
            <>
              <button type="button" className="secondary-button" onClick={() => setLogoutOpen(false)}>
                취소
              </button>
              <button type="button" className="danger-button" onClick={handleLogout}>
                확인
              </button>
            </>
          }
        >
          <p className="logout-confirm__text">로그아웃 하시겠습니까?</p>
        </ModalDialog>
      ) : null}
    </aside>
  );
}
