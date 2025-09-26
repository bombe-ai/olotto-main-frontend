import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Button } from "reactstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

declare global {
  interface Window {
    turnstile: any;
  }
}

const FORGOT_SITE_KEY = "0x4AAAAAABogye9PJul20McG"; // same site key you used on Register

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // Form + errors
  const [userCred, setUserCred] = useState({ phone: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // CAPTCHA state
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(
    null
  );
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const handlePhoneChange = (value: string | undefined) => {
    const phone = value || "";
    setUserCred((prev) => ({ ...prev, phone }));
    setErrors((prev) => ({ ...prev, phone: !phone.trim() }));
  };

  const validate = () => {
    const newErrs: Record<string, boolean> = {};
    if (!userCred.phone.trim()) newErrs.phone = true;
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const loadTurnstileScript = () =>
    new Promise<void>((resolve) => {
      const existing = document.getElementById("cf-turnstile");
      if (existing) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.id = "cf-turnstile";
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.onload = () => resolve();
      document.body.appendChild(s);
    });

  const mountTurnstile = () => {
    // Guard: need script loaded AND container present
    if (!window.turnstile || !turnstileRef.current) return;

    // If we already mounted, reset to get a fresh token
    if (turnstileWidgetId) {
      try {
        window.turnstile.reset(turnstileWidgetId);
      } catch (_) {
        /* ignore */
      }
    }

    const id = window.turnstile.render(turnstileRef.current, {
      sitekey: FORGOT_SITE_KEY,
      callback(token: string) {
        setCaptchaToken(token);
        setCaptchaError(false);
        setSubmitError(null);
      },
      "expired-callback"() {
        setCaptchaToken("");
        setCaptchaError(true);
      },
      "error-callback"() {
        setCaptchaToken("");
        setCaptchaError(true);
      },
      theme: "light",
    });
    setTurnstileWidgetId(id);
    setCaptchaReady(true);
  };

  useEffect(() => {
    let stale = false;

    const init = async () => {
      await loadTurnstileScript();
      // If the component unmounted, bail
      if (stale) return;

      // Turnstile may attach a global onload; still wait until it’s there
      const tryRender = () => {
        if (window.turnstile) {
          mountTurnstile();
        } else {
          // retry shortly; this handles SPA timing issues reliably
          setTimeout(tryRender, 100);
        }
      };
      tryRender();
    };

    init();

    return () => {
      stale = true;
      // Attempt to remove the widget to avoid duplicates on re-entry
      if (window.turnstile && turnstileWidgetId) {
        try {
          window.turnstile.remove(turnstileWidgetId);
        } catch (_) {
          /* ignore */
        }
      }
      setTurnstileWidgetId(null);
      setCaptchaReady(false);
      setCaptchaToken("");
    };
  }, []); // run once on mount

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!validate()) return;

    if (!captchaToken) {
      setCaptchaError(true);
      setSubmitError("Please complete the CAPTCHA.");
      // try a reset to force a fresh challenge
      if (window.turnstile && turnstileWidgetId)
        window.turnstile.reset(turnstileWidgetId);
      return;
    }

    try {
      const phoneNumber = userCred.phone; // for ESLint object-shorthand
      await axios.post("/api/forgot-password/send-otp", {
        phoneNumber,
        captchaToken,
      });

      navigate("/otp-verification", {
        state: { type: "forgot-password", phone: userCred.phone },
      });
      return;
    } catch (error: any) {
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        if (status === 404) {
          setSubmitError(
            data.message ||
              "No account found for this mobile number. Please register first."
          );
        } else if (status === 403) {
          setSubmitError(
            data.message || "CAPTCHA verification failed. Please try again."
          );
          if (window.turnstile && turnstileWidgetId)
            window.turnstile.reset(turnstileWidgetId);
          setCaptchaToken("");
          setCaptchaError(true);
        } else {
          setSubmitError(
            data.message || "Could not send OTP. Please try again."
          );
        }
      } else {
        // Network error or other error
        setSubmitError("Network error. Please try again.");
      }
    }
  };

  return (
    <article className="auth-card">
      <div className="auth-card-wrapper d-flex flex-column">
        <Button
          className="back-btn cta-btn cta-btn--text d-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} /> Back
        </Button>

        <header className="auth-card-header d-flex flex-column gap-2">
          <h1>Forgot Password</h1>
          <p>We’ll send an OTP to this number</p>
        </header>

        <Form
          className="auth-card-form d-flex flex-column h-100"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <FormGroup>
            <Label htmlFor="phone">
              Mobile number<span className="text-danger">*</span>
            </Label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={userCred.phone}
              onChange={handlePhoneChange}
              className={`phone-input ${errors.phone ? "is-invalid" : ""}`}
            />
          </FormGroup>

          {/* CAPTCHA */}
          <div ref={turnstileRef} className="mt-2" />
          {!captchaReady && (
            <div className="text-muted mt-2">Loading CAPTCHA…</div>
          )}
          {captchaError && (
            <div className="text-danger mt-2">
              Please complete the CAPTCHA before submitting.
            </div>
          )}
          {submitError && (
            <div className="alert alert-danger mt-3">{submitError}</div>
          )}

          <footer className="d-flex flex-column gap-2">
            <Button className="submit-btn mt-5" onClick={handleSubmit}>
              Send
            </Button>
            <p className="text-center">
              You don&apos;t have an account?{" "}
              <a href="/register">Register here</a>
            </p>
          </footer>
        </Form>
      </div>
    </article>
  );
};

export default ForgotPassword;
