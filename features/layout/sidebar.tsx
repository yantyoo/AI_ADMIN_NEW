"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { navItems } from "@/features/layout/config";
import { clearAuthProfile, readStoredAuthProfile } from "@/features/layout/session";

const AUTH_STAGE_KEY = "xperp-auth-stage";
const AUTH_AUTHENTICATED_KEY = "xperp-authenticated";
const AUTH_USER_KEY = "xperp-auth-user";
const AUTH_OTP_FAILURES_KEY = "xperp-auth-otp-failures";
const AUTH_OTP_LOCKED_KEY = "xperp-auth-otp-locked";

export function Sidebar() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
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
    router.replace("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">XpERP</div>
        <div className="sidebar__badge">AI 챗봇 관리자</div>
      </div>

      <nav className="sidebar__nav" aria-label="주 메뉴">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`sidebar__nav-item${isActive ? " is-active" : ""}`}
            >
              <span className="sidebar__nav-icon" aria-hidden="true">
                {item.key.slice(0, 1).toUpperCase()}
              </span>
              <span>{item.label}</span>
            </Link>
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
        <button type="button" className="secondary-button sidebar__logout" onClick={() => setLogoutOpen(true)}>
          로그아웃
        </button>
      </div>

      {logoutOpen ? (
        <div className="modal-backdrop logout-backdrop" role="presentation" onClick={() => setLogoutOpen(false)}>
          <section
            className="modal modal--compact"
            role="dialog"
            aria-modal="true"
            aria-label="로그아웃 확인"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header modal__header--tight">
              <h3>로그아웃</h3>
            </div>
            <div className="modal__body">
              <p className="logout-confirm__text">로그아웃 하시겠습니까?</p>
            </div>
            <div className="modal__footer modal__footer--split">
              <button type="button" className="secondary-button" onClick={() => setLogoutOpen(false)}>
                취소
              </button>
              <button type="button" className="danger-button" onClick={handleLogout}>
                확인
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </aside>
  );
}
