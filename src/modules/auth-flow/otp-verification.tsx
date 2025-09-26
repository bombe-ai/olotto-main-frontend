import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button, Spinner } from "reactstrap";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";

type FlowType = "register" | "forgot-password";

interface OtpState {
  phone: string;
  type: FlowType;
  // registration extras
  password?: string;
  firstName?: string;
  lastName?: string;
}

const COOLDOWN_SEC = 180;
const OTP_VALID_SEC = 180;

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: OtpState };

  // ---- guard against direct access without state ----
  useEffect(() => {
    if (!state?.phone || !state?.type) {
      navigate("/login");
    }
  }, [state, navigate]);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // timers
  const [now, setNow] = useState(dayjs());
  const [otpExpiryTime, setOtpExpiryTime] = useState(
    dayjs().add(OTP_VALID_SEC, "second")
  );
  const [resendAvailableAt, setResendAvailableAt] = useState(
    dayjs().add(COOLDOWN_SEC, "second")
  ); // initial cooldown since user just sent OTP

  // tick every second
  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  // on mount: ask server for remaining cooldown so refresh is accurate
  useEffect(() => {
    const init = async () => {
      if (!state?.phone) return;
      try {
        const response = await axios.get(
          `/api/otp-remaining?phoneNumber=${encodeURIComponent(state.phone)}`
        );
        const data = response.data;
        const remain = Number(data?.remainingSeconds ?? 0);
        if (remain > 0) {
          setResendAvailableAt(dayjs().add(remain, "second"));
        } else {
          setResendAvailableAt(dayjs()); // can resend now
        }
        // We don't know createdAt from first send unless previous page passed it.
        // Set a conservative expiry from *now*. On successful resend, we'll sync exact times.
        setOtpExpiryTime(dayjs().add(OTP_VALID_SEC, "second"));
      } catch {
        // Fallbacks
        setResendAvailableAt(dayjs().add(COOLDOWN_SEC, "second")); // conservative
        setOtpExpiryTime(dayjs().add(OTP_VALID_SEC, "second"));
      }
    };
    init();
  }, [state?.phone]);

  const isOtpExpired = useMemo(
    () => now.isAfter(otpExpiryTime),
    [now, otpExpiryTime]
  );
  const canResend = useMemo(
    () => now.isAfter(resendAvailableAt),
    [now, resendAvailableAt]
  );

  const formatTimeLeft = (futureTime: dayjs.Dayjs) => {
    const diff = Math.max(0, futureTime.diff(now, "second"));
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const loginUser = async () => {
    // after successful registration, auto-login the user
    try {
      const response = await axios.post("api/login-phone", {
        phoneNumber: state.phone,
        password: state.password,
      });

      if (response.status === 200) {
        localStorage.setItem("jhi-authenticationToken", response.data.id_token);
        window.location.href = "/";
      } else {
        setAlertMessage("Login failed. Please try logging in manually.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Login error:", err);
      setAlertMessage("Login failed. Please try logging in manually.");
      navigate("/login");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setError(false);
    setAlertMessage(null);
  };

  const handleSubmit = async () => {
    if (!otp.trim()) {
      setError(true);
      setAlertMessage("Please enter the OTP.");
      return;
    }
    if (isOtpExpired) {
      setAlertMessage("Your OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);
    setAlertMessage(null);

    try {
      if (state.type === "register") {
        // Verify registration OTP and create account
        await axios.post("/api/verify-otp-registration", {
          phoneNumber: state.phone,
          otp,
          password: state.password,
          firstName: state.firstName,
          lastName: state.lastName,
        });

        // navigate('/registration-success');
        await loginUser();
        toast.success("Registration successful! Logged in.");
      } else {
        // forgot-password: verify → get resetToken
        const response = await axios.post("/api/forgot-password/verify-otp", {
          phoneNumber: state.phone,
          otp,
        });

        const data = response.data;
        if (data?.resetToken) {
          navigate("/reset-password", {
            state: { resetToken: data.resetToken },
          });
        } else {
          setAlertMessage("Something went wrong.");
        }
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          setAlertMessage("No OTP request found. Please start again.");
          navigate(
            state.type === "register" ? "/register" : "/forgot-password"
          );
        } else if (status === 410) {
          setAlertMessage("Your OTP has expired. Please request a new one.");
        } else if (status === 409 && state.type === "register") {
          setAlertMessage("This phone number is already registered.");
          navigate("/login");
        } else if (status === 401) {
          setAlertMessage("Invalid OTP. Please try again.");
        } else {
          setAlertMessage(data?.message || "Something went wrong.");
        }
      } else {
        setAlertMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    setAlertMessage(null);

    // Correct resend endpoints (no CAPTCHA on resend)
    const url =
      state.type === "register"
        ? "/api/resend-otp-registration"
        : "/api/forgot-password/resend-otp";

    try {
      const response = await axios.post(url, {
        phoneNumber: state.phone,
      });

      const data = response.data;

      // Server returns createdAt + expiresInSeconds in otpResponse
      const createdAt = dayjs(data?.createdAt ?? dayjs());
      const expiresSec = Number(data?.expiresInSeconds ?? OTP_VALID_SEC);

      // lock resend for another COOLDOWN_SEC
      setResendAvailableAt(dayjs().add(COOLDOWN_SEC, "second"));
      // reset OTP validity window using server-provided createdAt
      setOtpExpiryTime(createdAt.add(expiresSec, "second"));
      setOtp("");
      setAlertMessage("A new OTP has been sent.");
    } catch (error: any) {
      console.error("Resend OTP error:", error);

      if (error.response) {
        const { status, data } = error.response;

        // 429 → cooldown response shape: { remainingSeconds }
        if (status === 429) {
          const remain = Number(data?.remainingSeconds ?? COOLDOWN_SEC);
          setResendAvailableAt(dayjs().add(remain, "second"));
          setAlertMessage(
            `Please wait ${Math.ceil(remain / 60)} minute(s) to resend.`
          );
          return;
        }

        // Other server errors
        setAlertMessage(data?.message || "Failed to resend OTP.");
      } else {
        setAlertMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
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
          <h1>Verification</h1>
          <p>Enter the OTP sent to your phone</p>
        </header>

        <Form
          className="auth-card-form d-flex flex-column h-100"
          onSubmit={(e) => e.preventDefault()}
        >
          {alertMessage && (
            <div className="alert alert-danger" role="alert">
              {alertMessage}
            </div>
          )}

          <FormGroup>
            <Label htmlFor="otp">
              OTP<span className="text-danger">*</span>
            </Label>
            <Input
              id="otp"
              name="otp"
              placeholder="******"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              invalid={error}
              onChange={handleChange}
              disabled={isOtpExpired || loading}
            />
            <small className={isOtpExpired ? "text-danger" : "text-muted"}>
              {isOtpExpired
                ? "OTP has expired. Please resend."
                : `Expires in ${formatTimeLeft(otpExpiryTime)}`}
            </small>
          </FormGroup>

          <p className="text-center">
            Didn&apos;t receive it?{" "}
            {canResend ? (
              <span
                style={{ cursor: "pointer", color: "#007bff" }}
                onClick={handleResendOtp}
              >
                Resend OTP
              </span>
            ) : (
              <span className="text-muted">
                Try again in {formatTimeLeft(resendAvailableAt)}
              </span>
            )}
          </p>

          <footer className="d-flex flex-column gap-3">
            <Button
              className="submit-btn mt-5"
              onClick={handleSubmit}
              disabled={isOtpExpired || !otp.trim() || loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </footer>
        </Form>
      </div>
    </article>
  );
};

export default OTPVerification;
