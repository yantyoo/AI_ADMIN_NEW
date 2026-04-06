"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AUTH_STAGE_KEY = "xperp-auth-stage";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const stage = window.sessionStorage.getItem(AUTH_STAGE_KEY);
    router.replace(stage === "authenticated" ? "/dashboard" : "/login");
  }, [router]);

  return null;
}
