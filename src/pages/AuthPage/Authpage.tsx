// AuthPage.tsx
import React, { useState, useCallback } from "react";
import styles from "./Authpage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─── Types ───────────────────────────────────────────────── */
type Tab = "login" | "signup";
type Role = "DRIVER" | "PASSENGER";

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

interface FieldErrors {
  [key: string]: string;
}

/* ─── SVG Icons ───────────────────────────────────────────── */
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
  </svg>
);

const IconCar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
    <circle cx="7.5" cy="17" r="1.5" />
    <circle cx="16.5" cy="17" r="1.5" />
    <path d="M5 12h14" />
  </svg>
);

const IconEye = ({ off }: { off?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const IconPassenger = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 20a7 7 0 0113 0" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ─── Validators ──────────────────────────────────────────── */
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(form: LoginForm): FieldErrors {
  const e: FieldErrors = {};
  if (!form.email) e.email = "Email is required";
  else if (!emailRx.test(form.email)) e.email = "Enter a valid email";
  if (!form.password) e.password = "Password is required";
  else if (form.password.length < 6) e.password = "Minimum 6 characters";
  return e;
}

function validateSignup(form: SignupForm): FieldErrors {
  const e: FieldErrors = {};
  if (!form.name.trim()) e.name = "Full name is required";
  if (!form.email) e.email = "Email is required";
  else if (!emailRx.test(form.email)) e.email = "Enter a valid email";
  if (!form.password) e.password = "Password is required";
  else if (form.password.length < 6) e.password = "Minimum 6 characters";
  if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
  else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
  return e;
}

/* ─── Reusable Input Field ───────────────────────────────── */
interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  isPassword?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label, icon, type = "text", placeholder, value, onChange, error, isPassword,
}) => {
  const [showPw, setShowPw] = useState(false);
  const inputType = isPassword ? (showPw ? "text" : "password") : type;

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.inputWrapper}>
        <span className={styles.inputIcon}>{icon}</span>
        <input
          className={`${styles.input} ${error ? styles.hasError : ""}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={isPassword ? "current-password" : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPw((p) => !p)}
            tabIndex={-1}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            <IconEye off={!showPw} />
          </button>
        )}
      </div>
      {error && <span className={styles.fieldError}>⚠ {error}</span>}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);

  /* Login state */
  const [login, setLogin] = useState<LoginForm>({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<FieldErrors>({});

  /* Signup state */
  const [signup, setSignup] = useState<SignupForm>({
    name: "", email: "", password: "", confirmPassword: "",
    role: "PASSENGER",
  });
  const [signupErrors, setSignupErrors] = useState<FieldErrors>({});

  const setSignupField = useCallback(
    <K extends keyof SignupForm>(key: K) =>
      (val: SignupForm[K]) => setSignup((p) => ({ ...p, [key]: val })),
    []
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin(login);
    setLoginErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", login);
      if (res.status === 200 || res.status === 201) {
        toast.success("Logged in successfully.");
        setTimeout(() => navigate("/"), 1200);
      } else {
        toast.error("Unable to sign in. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateSignup(signup);
    setSignupErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/signup", signup);
      if (res.status === 200 || res.status === 201) {
        toast.success("Account created successfully.");
        setSignup({ name: "", email: "", password: "", confirmPassword: "", role: "PASSENGER" });
        setTimeout(() => switchTab("login"), 1200);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setLoading(false);
    setLoginErrors({});
    setSignupErrors({});
  };

  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* ─── Left Panel ─── */}
      <aside className={styles.leftPanel}>
        <div className={styles.mapGrid} aria-hidden="true" />

        <div className={styles.brand} onClick={() => {navigate("/")}}>
          <div className={styles.logoMark}>
            <IconPin />
          </div>
          <span className={styles.brandName} >Ryde</span>
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Premium Mobility</p>
          <h1 className={styles.heroTitle}>
            Move smarter,<br />
            arrive <em>faster</em>.
          </h1>
          <p className={styles.heroSub}>
            Real-time geolocation matching connects drivers and passengers instantly. Reliable, transparent, always on.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>2.4M</span>
            <span className={styles.statLabel}>Active riders</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>98%</span>
            <span className={styles.statLabel}>On-time rate</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>4.9★</span>
            <span className={styles.statLabel}>Avg. rating</span>
          </div>
        </div>
      </aside>

      {/* ─── Right Panel ─── */}
      <main className={styles.rightPanel}>
        <div className={styles.formContainer}>

          {/* Tab Switcher */}
          <div className={styles.tabSwitcher} role="tablist">
            <button
              role="tab"
              aria-selected={tab === "login"}
              className={`${styles.tabBtn} ${tab === "login" ? styles.active : ""}`}
              onClick={() => switchTab("login")}
            >
              Sign In
            </button>
            <button
              role="tab"
              aria-selected={tab === "signup"}
              className={`${styles.tabBtn} ${tab === "signup" ? styles.active : ""}`}
              onClick={() => switchTab("signup")}
            >
              Create Account
            </button>
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} noValidate>
              <div className={styles.formHeading}>
                <h2 className={styles.formTitle}>Welcome back</h2>
                <p className={styles.formSubtitle}>Sign in to continue your journey.</p>
              </div>

              <div className={styles.formFields}>
                <InputField
                  label="Email address"
                  icon={<IconMail />}
                  type="email"
                  placeholder="you@example.com"
                  value={login.email}
                  onChange={(v) => setLogin((p) => ({ ...p, email: v }))}
                  error={loginErrors.email}
                />
                <InputField
                  label="Password"
                  icon={<IconLock />}
                  placeholder="••••••••"
                  value={login.password}
                  onChange={(v) => setLogin((p) => ({ ...p, password: v }))}
                  error={loginErrors.password}
                  isPassword
                />
                <div className={styles.forgotRow}>
                  <a href="#" className={styles.forgotLink}>Forgot password?</a>
                </div>
              </div>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>Continue</span>
                <span className={styles.dividerLine} />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                <span className={styles.btnContent}>
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>Sign In <IconArrow /></>
                  )}
                </span>
              </button>

              <p className={styles.terms}>
                Don't have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); switchTab("signup"); }}>
                  Create one free
                </a>
              </p>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} noValidate>
              <div className={styles.formHeading}>
                <h2 className={styles.formTitle}>Join Ryde</h2>
                <p className={styles.formSubtitle}>Create your account in under a minute.</p>
              </div>

              {/* Role Selector */}
              <div className={styles.roleSelector}>
                <label className={`${styles.roleCard} ${signup.role === "PASSENGER" ? styles.selected : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="PASSENGER"
                    checked={signup.role === "PASSENGER"}
                    onChange={() => setSignupField("role")("PASSENGER")}
                  />
                  <div className={styles.roleIcon}><IconPassenger /></div>
                  <span className={styles.roleLabel}>Passenger</span>
                  <span className={styles.roleDesc}>Book rides instantly</span>
                </label>

                <label className={`${styles.roleCard} ${signup.role === "DRIVER" ? styles.selected : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="DRIVER"
                    checked={signup.role === "DRIVER"}
                    onChange={() => setSignupField("role")("DRIVER")}
                  />
                  <div className={styles.roleIcon}><IconCar /></div>
                  <span className={styles.roleLabel}>Driver</span>
                  <span className={styles.roleDesc}>Earn on your schedule</span>
                </label>
              </div>

              {/* Base fields */}
              <div className={styles.formFields}>
                <InputField
                  label="Full name"
                  icon={<IconUser />}
                  placeholder="Alex Johnson"
                  value={signup.name}
                  onChange={setSignupField("name")}
                  error={signupErrors.name}
                />
                <InputField
                  label="Email address"
                  icon={<IconMail />}
                  type="email"
                  placeholder="you@example.com"
                  value={signup.email}
                  onChange={setSignupField("email")}
                  error={signupErrors.email}
                />
                <div className={styles.fieldRow}>
                  <InputField
                    label="Password"
                    icon={<IconLock />}
                    placeholder="Min. 6 chars"
                    value={signup.password}
                    onChange={setSignupField("password")}
                    error={signupErrors.password}
                    isPassword
                  />
                  <InputField
                    label="Confirm password"
                    icon={<IconLock />}
                    placeholder="Repeat password"
                    value={signup.confirmPassword}
                    onChange={setSignupField("confirmPassword")}
                    error={signupErrors.confirmPassword}
                    isPassword
                  />
                </div>

                {/* Driver-only fields */}
                {/* {signup.role === "DRIVER" && (
                  <div className={styles.driverFields}>
                    <span className={styles.driverFieldsLabel}>Vehicle details</span>
                    <InputField
                      label="Vehicle number"
                      icon={<IconId />}
                      placeholder="e.g. DL 01 AB 1234"
                      value={signup.vehicleNumber}
                      onChange={setSignupField("vehicleNumber")}
                      error={signupErrors.vehicleNumber}
                    />
                    <InputField
                      label="Vehicle model"
                      icon={<IconCar />}
                      placeholder="e.g. Honda City 2022"
                      value={signup.vehicleModel}
                      onChange={setSignupField("vehicleModel")}
                      error={signupErrors.vehicleModel}
                    />
                    <InputField
                      label="License number"
                      icon={<IconId />}
                      placeholder="e.g. DL-1420110012345"
                      value={signup.licenseNumber}
                      onChange={setSignupField("licenseNumber")}
                      error={signupErrors.licenseNumber}
                    />
                  </div>
                )} */}
              </div>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>Continue</span>
                <span className={styles.dividerLine} />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                <span className={styles.btnContent}>
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>Create Account <IconArrow /></>
                  )}
                </span>
              </button>

              <p className={styles.terms}>
                By signing up you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </p>
            </form>
          )}

        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default AuthPage;