"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AUTH_OTP_FAILURES_KEY,
  AUTH_OTP_LOCKED_KEY,
  AUTH_PROFILE_KEY,
  AUTH_STAGE_KEY,
  AUTH_USER_KEY,
  readStoredAuthProfile,
  resolveAuthProfile,
  storeAuthProfile
} from "@/features/layout/session";

type AuthFormState = {
  userId: string;
  password: string;
  otp: string;
};

const defaultState: AuthFormState = {
  userId: "",
  password: "",
  otp: ""
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const OTP_CODE = "123456";
const OTP_MAX_FAILURES = 5;

const readNumber = (value: string | null) => {
  const parsed = Number(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
};

export function AuthScreen() {
  const router = useRouter();
  const [form, setForm] = useState<AuthFormState>(defaultState);
  const [helper, setHelper] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberId, setRememberId] = useState(true);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpFailures, setOtpFailures] = useState(0);
  const [otpLocked, setOtpLocked] = useState(false);

  const otpMessage = useMemo(() => {
    if (otpLocked) {
      return "OTP 오류가 누적되어 잠금된 아이디입니다. 관리자에게 문의하세요.";
    }

    if (otpFailures > 0) {
      return `OTP 인증에 실패했습니다. (${otpFailures}/${OTP_MAX_FAILURES})`;
    }

    return "OTP를 입력하면 로그인 완료됩니다.";
  }, [otpFailures, otpLocked]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stage = window.sessionStorage.getItem(AUTH_STAGE_KEY);
    const userId = window.sessionStorage.getItem(AUTH_USER_KEY) ?? window.localStorage.getItem(AUTH_USER_KEY) ?? "";
    const locked = window.sessionStorage.getItem(AUTH_OTP_LOCKED_KEY) === "true";
    const failures = readNumber(window.sessionStorage.getItem(AUTH_OTP_FAILURES_KEY));

    if (stage === "authenticated") {
      router.replace("/dashboard");
      return;
    }

    setForm((current) => ({ ...current, userId }));
    setOtpLocked(locked);
    setOtpFailures(failures);
    setOtpOpen(stage === "otp_pending" && Boolean(userId));
  }, [router]);

  const updateField = (field: keyof AuthFormState) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const openOtp = () => {
    setOtpOpen(true);
    setError("");
    setHelper("");
    setOtpFailures(0);
    setOtpLocked(false);
  };

  const closeOtp = () => {
    setOtpOpen(false);
    setForm((current) => ({ ...current, otp: "" }));
    setHelper("");
    setError("");
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!form.userId.trim() || !form.password.trim()) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setHelper("OTP 입력 창을 여는 중입니다.");
    const userId = form.userId.trim();

    window.sessionStorage.setItem(AUTH_STAGE_KEY, "otp_pending");
    window.sessionStorage.setItem(AUTH_USER_KEY, userId);
    window.sessionStorage.setItem(AUTH_OTP_FAILURES_KEY, "0");
    window.sessionStorage.removeItem(AUTH_OTP_LOCKED_KEY);

    if (rememberId) {
      window.localStorage.setItem(AUTH_USER_KEY, userId);
    } else {
      window.localStorage.removeItem(AUTH_USER_KEY);
    }

    await sleep(250);
    setLoading(false);
    openOtp();
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading || !otpOpen) {
      return;
    }

    if (otpLocked) {
      setError("OTP 오류로 잠금된 아이디입니다. 관리자에게 문의하세요.");
      return;
    }

    if (form.otp.trim().length !== 6) {
      setError("6자리 OTP를 입력해 주세요.");
      return;
    }

    setLoading(true);

    if (form.otp.trim() !== OTP_CODE) {
      const nextFailures = otpFailures + 1;
      const isLocked = nextFailures >= OTP_MAX_FAILURES;
      setOtpFailures(nextFailures);
      window.sessionStorage.setItem(AUTH_OTP_FAILURES_KEY, String(nextFailures));

      if (isLocked) {
        setOtpLocked(true);
        window.sessionStorage.setItem(AUTH_OTP_LOCKED_KEY, "true");
        setError("OTP 오류로 잠금된 아이디입니다. 관리자에게 문의하세요.");
      } else {
        setError(`OTP 인증에 실패했습니다. (${nextFailures}/${OTP_MAX_FAILURES})`);
      }

      setLoading(false);
      return;
    }

    const profile = resolveAuthProfile(form.userId.trim());
    storeAuthProfile(profile, rememberId);
    window.sessionStorage.setItem(AUTH_STAGE_KEY, "authenticated");
    window.sessionStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
    window.sessionStorage.removeItem(AUTH_OTP_FAILURES_KEY);
    window.sessionStorage.removeItem(AUTH_OTP_LOCKED_KEY);

    setHelper("대시보드로 이동합니다.");
    await sleep(250);
    router.replace("/dashboard");
  };

  const isLoginDisabled = loading || !form.userId.trim() || !form.password.trim();
  const isOtpDisabled = loading || otpLocked || form.otp.trim().length !== 6;
  const storedProfile = readStoredAuthProfile();

  return (
    <main className="auth-shell">
      <section className="auth-card auth-standalone">
        <div className="auth-card__intro auth-standalone__intro">
          <span className="auth-card__badge">XpERP</span>
          <h1 className="auth-card__title">관리자 로그인</h1>
          <p className="auth-card__description">
            아이디와 비밀번호를 입력한 뒤 OTP 팝업에서 인증을 완료합니다.
          </p>

          <ul className="auth-card__guide">
            <li>OTP 팝업은 로그인 화면 안에서 표시됩니다.</li>
            <li>인증 성공 시 대시보드로 이동합니다.</li>
            <li>아이디 저장은 선택한 경우에만 유지됩니다.</li>
          </ul>
        </div>

        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <div className="auth-form__header">
            <h2 className="auth-form__title">관리자 계정 인증</h2>
            <p className="auth-form__caption">
              현재 선택된 계정: {storedProfile.userId || form.userId || "미선택"}
            </p>
          </div>

          <div className="auth-form__fields">
            <label className="field auth-field">
              <span className="field__label">아이디</span>
              <input
                className="field__input auth-input"
                value={form.userId}
                onChange={(event) => updateField("userId")(event.target.value)}
                placeholder="예: admin01"
                autoComplete="username"
              />
            </label>

            <label className="field auth-field">
              <span className="field__label">비밀번호</span>
              <input
                type="password"
                className="field__input auth-input"
                value={form.password}
                onChange={(event) => updateField("password")(event.target.value)}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
              />
            </label>

            <label className="auth-remember">
              <input
                type="checkbox"
                checked={rememberId}
                onChange={(event) => setRememberId(event.target.checked)}
              />
              <span>아이디 저장</span>
            </label>
          </div>

          <div className="auth-form__actions">
            <button type="submit" className="primary-button auth-submit" disabled={isLoginDisabled}>
              {loading ? "처리 중..." : "다음"}
            </button>
            <button
              type="button"
              className="secondary-button auth-cancel"
              onClick={() => {
                setForm(defaultState);
                setError("");
                setHelper("");
                setOtpOpen(false);
                setOtpFailures(0);
                setOtpLocked(false);
                window.sessionStorage.removeItem(AUTH_STAGE_KEY);
                window.sessionStorage.removeItem(AUTH_USER_KEY);
                window.sessionStorage.removeItem(AUTH_OTP_FAILURES_KEY);
                window.sessionStorage.removeItem(AUTH_OTP_LOCKED_KEY);
                window.sessionStorage.removeItem(AUTH_PROFILE_KEY);
                window.localStorage.removeItem(AUTH_USER_KEY);
              }}
            >
              초기화
            </button>
          </div>

          <div className="auth-form__feedback" aria-live="polite">
            {error ? <p className="auth-error">{error}</p> : null}
            {!error && helper ? <p className="auth-helper">{helper}</p> : null}
          </div>
        </form>
      </section>

      {otpOpen ? (
        <div className="modal-backdrop auth-otp-backdrop" role="presentation" onClick={closeOtp}>
          <section
            className="modal auth-otp-modal"
            role="dialog"
            aria-modal="true"
            aria-label="OTP 인증"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header auth-otp-modal__header">
              <div>
                <h3>OTP 인증</h3>
                <p className="auth-otp-modal__caption">{otpMessage}</p>
              </div>
              <button type="button" className="icon-button" onClick={closeOtp}>
                ×
              </button>
            </div>

            <form className="auth-otp-modal__body" onSubmit={handleOtpSubmit}>
              <label className="field auth-otp-field">
                <span className="field__label">OTP</span>
                <input
                  className="field__input auth-input auth-input--otp"
                  value={form.otp}
                  onChange={(event) => updateField("otp")(event.target.value)}
                  placeholder="6자리 OTP 입력"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  disabled={otpLocked}
                />
              </label>

              <div className="auth-form__feedback" aria-live="polite">
                {error ? <p className="auth-error">{error}</p> : null}
                {!error && helper ? <p className="auth-helper">{helper}</p> : null}
              </div>

              <div className="auth-form__actions auth-otp-modal__actions">
                <button type="button" className="secondary-button auth-cancel" onClick={closeOtp}>
                  이전
                </button>
                <button type="submit" className="primary-button auth-submit" disabled={isOtpDisabled}>
                  {loading ? "처리 중..." : "인증 완료"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
