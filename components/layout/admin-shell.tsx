"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/features/layout/sidebar";
import { TopHeader } from "@/features/layout/top-header";
import { pageMetaByPath } from "@/features/layout/config";

const AUTH_STAGE_KEY = "xperp-mock-auth-stage";
const PUBLIC_ROUTES = new Set(["/login", "/otp"]);

export function AdminShell({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";
  const router = useRouter();
  const pageMeta = pageMetaByPath[currentPath] ?? pageMetaByPath["/"];
  const isPublicRoute = PUBLIC_ROUTES.has(currentPath);
  const [authStage, setAuthStage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setAuthStage(window.sessionStorage.getItem(AUTH_STAGE_KEY));
    setIsReady(true);
  }, [currentPath]);

  useEffect(() => {
    if (!isReady || isPublicRoute) {
      return;
    }

    if (authStage !== "authenticated") {
      router.replace("/login");
    }
  }, [authStage, isPublicRoute, isReady, router]);

  if (!isPublicRoute && !isReady) {
    return null;
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-shell__main">
        <TopHeader title={pageMeta.title} description={pageMeta.description} />
        <main className="admin-shell__content">{children}</main>
      </div>
    </div>
  );
}
