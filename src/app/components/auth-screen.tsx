import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { ModalPortal } from "@/components/ui/modal-portal";
import {
  AUTH_OTP_FAILURES_KEY,
  AUTH_OTP_LOCKED_KEY,
  AUTH_PROFILE_KEY,
  AUTH_STAGE_KEY,
  AUTH_USER_KEY,
  storeAuthProfile
} from "@/features/layout/session";

type AuthFormState = {
  userId: string;
  password: string;
  otp: string;
};

type NoticeModalState = {
  title: string;
  message: string;
} | null;

type AuthScreenProps = {
  onAuthenticated: () => void;
};

const USER_ID_MAX_LENGTH = 10;
const PASSWORD_MAX_LENGTH = 12;
const OTP_CODE = "123456";
const OTP_MAX_FAILURES = 5;

const INVALID_CREDENTIALS_NOTICE = {
  title: "로그인 오류",
  message: "아이디 또는 비밀번호가 올바르지 않습니다.\n다시 확인해 주세요."
};

const UNAUTHORIZED_NOTICE = {
  title: "권한 없음",
  message: "권한이 없는 사용자입니다.\n관리자에게 권한을 요청해 주세요."
};

const OTP_LOCKED_NOTICE = {
  title: "OTP 잠금",
  message: "OTP 오류로 잠금된 아이디 입니다.\n관리자에게 문의하세요."
};

type MockAuthAccount = {
  password: string;
  profile: {
    userId: string;
    id: string;
    name: string;
    role: "MASTER" | "OPERATOR";
    department: string;
  };
  allowed: boolean;
};

const MOCK_AUTH_ACCOUNTS: Record<string, MockAuthAccount> = {
  test0000: {
    password: "a123456789",
    profile: {
      userId: "test0000",
      id: "chat1004",
      name: "박승준",
      role: "MASTER",
      department: "운영 관리자"
    },
    allowed: true
  },
  test1111: {
    password: "a123456789",
    profile: {
      userId: "test1111",
      id: "op2031",
      name: "권태영",
      role: "OPERATOR",
      department: "운영 담당"
    },
    allowed: true
  },
  blocked0000: {
    password: "a123456789",
    profile: {
      userId: "blocked0000",
      id: "op9001",
      name: "차단계정",
      role: "OPERATOR",
      department: "권한 미부여"
    },
    allowed: false
  }
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

const readNumber = (value: string | null) => {
  const parsed = Number(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeUserId = (value: string) =>
  value.replace(/[^A-Za-z0-9]/g, "").slice(0, USER_ID_MAX_LENGTH);

const normalizePassword = (value: string) =>
  value.replace(/[^A-Za-z0-9]/g, "").slice(0, PASSWORD_MAX_LENGTH);

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [form, setForm] = useState<AuthFormState>(defaultState);
  const [helper, setHelper] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberId, setRememberId] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpFailures, setOtpFailures] = useState(0);
  const [otpLocked, setOtpLocked] = useState(false);
  const [noticeModal, setNoticeModal] = useState<NoticeModalState>(null);

  const otpMessage = useMemo(() => {
    if (otpLocked) {
      return "OTP 오류로 잠금된 아이디입니다. 관리자에게 문의하세요.";
    }

    if (otpFailures > 0) {
      return `OTP 인증에 실패했습니다. (${otpFailures}/${OTP_MAX_FAILURES})`;
    }

    return "OTP를 입력하면 로그인 절차를 완료합니다.";
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
      onAuthenticated();
      return;
    }

    const normalizedUserId = normalizeUserId(userId);

    setForm((current) => ({ ...current, userId: normalizedUserId }));
    setOtpLocked(locked);
    setOtpFailures(failures);
    setOtpOpen(stage === "otp_pending" && Boolean(normalizedUserId));
  }, [onAuthenticated]);

  const updateField = (field: keyof AuthFormState) => (value: string) => {
    const nextValue =
      field === "userId"
        ? normalizeUserId(value)
        : field === "password"
          ? normalizePassword(value)
          : value;

    setForm((current) => ({ ...current, [field]: nextValue }));
    setError("");
  };

  const openNoticeModal = (notice: { title: string; message: string }) => {
    setNoticeModal(notice);
  };

  const closeNoticeModal = () => {
    setNoticeModal(null);
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

    const userId = normalizeUserId(form.userId.trim());
    const password = normalizePassword(form.password.trim());
    const account = MOCK_AUTH_ACCOUNTS[userId];

    if (!account || account.password !== password) {
      openNoticeModal(INVALID_CREDENTIALS_NOTICE);
      return;
    }

    if (!account.allowed) {
      openNoticeModal(UNAUTHORIZED_NOTICE);
      return;
    }

    setLoading(true);
    setHelper("OTP 입력 창을 여는 중입니다.");

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
      openNoticeModal(OTP_LOCKED_NOTICE);
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
        openNoticeModal(OTP_LOCKED_NOTICE);
      } else {
        setError(`OTP 인증에 실패했습니다. (${nextFailures}/${OTP_MAX_FAILURES})`);
      }

      setLoading(false);
      return;
    }

    const account = MOCK_AUTH_ACCOUNTS[form.userId.trim()];
    const profile =
      account?.profile ?? {
        userId: form.userId.trim(),
        id: form.userId.trim(),
        name: form.userId.trim(),
        role: "MASTER",
        department: "운영 관리자"
      };

    storeAuthProfile(profile, rememberId);
    window.sessionStorage.setItem(AUTH_STAGE_KEY, "authenticated");
    window.sessionStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
    window.sessionStorage.removeItem(AUTH_OTP_FAILURES_KEY);
    window.sessionStorage.removeItem(AUTH_OTP_LOCKED_KEY);

    setHelper("대시보드로 이동합니다.");
    await sleep(250);
    onAuthenticated();
  };

  const isLoginDisabled = loading || !form.userId.trim() || !form.password.trim();
  const isOtpDisabled = loading || otpLocked || form.otp.trim().length !== 6;

  return (
    <main className="auth-shell auth-shell--standalone">
      <section className="auth-card auth-standalone">
        <div className="auth-card__intro auth-standalone__intro">
          <span className="auth-card__badge">Xp도우미</span>
          <h1 className="auth-card__title">Xp도우미 관리자</h1>
          <p className="auth-card__eyebrow">관리자 전용 시스템</p>
          <p className="auth-card__description">
            본 시스템은 내부 관리자 전용입니다.
            <br />
            무단 접근 및 정보 열람 시 관련 법령에 따라 책임이 발생할 수 있습니다.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <div className="auth-form__header">
            <h2 className="auth-form__title">관리자 로그인</h2>
            <p className="auth-form__caption">승인된 계정만 접속 가능합니다.</p>
          </div>

          <div className="auth-form__fields">
            <label className="field auth-field">
              <span className="field__label">아이디</span>
              <input
                className="field__input auth-input"
                maxLength={USER_ID_MAX_LENGTH}
                value={form.userId}
                onChange={(event) => updateField("userId")(event.target.value)}
                placeholder="예: admin01"
                autoComplete="username"
                inputMode="text"
              />
            </label>

            <label className="field auth-field">
              <span className="field__label">비밀번호</span>
              <input
                type="password"
                className="field__input auth-input"
                maxLength={PASSWORD_MAX_LENGTH}
                value={form.password}
                onChange={(event) => updateField("password")(event.target.value)}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                inputMode="text"
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
              {loading ? "처리 중..." : "로그인"}
            </button>
          </div>

          <div className="auth-form__feedback" aria-live="polite">
            {error ? <p className="auth-error">{error}</p> : null}
            {!error && helper ? <p className="auth-helper">{helper}</p> : null}
          </div>
        </form>
      </section>

      {otpOpen ? (
        <ModalPortal backdropClassName="auth-otp-backdrop" onBackdropClick={closeOtp}>
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
                  취소
                </button>
                <button type="submit" className="primary-button auth-submit" disabled={isOtpDisabled}>
                  {loading ? "처리 중..." : "인증 완료"}
                </button>
              </div>
            </form>
          </section>
        </ModalPortal>
      ) : null}

      {noticeModal ? (
        <ModalDialog
          title={noticeModal.title}
          ariaLabel={noticeModal.title}
          onClose={closeNoticeModal}
          size="sm"
          compact
          backdropClassName="auth-notice-backdrop"
          className="auth-notice-modal"
          headerClassName="modal__header--tight auth-notice-modal__header"
          bodyClassName="auth-notice-modal__body"
          footerClassName="modal__footer--split"
          footer={
            <button type="button" className="primary-button" onClick={closeNoticeModal}>
              확인
            </button>
          }
        >
          <p className="auth-notice-modal__message">{noticeModal.message}</p>
        </ModalDialog>
      ) : null}
    </main>
  );
}
