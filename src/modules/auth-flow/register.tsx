import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
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

const Register = () => {
  const navigate = useNavigate();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(
    null
  );

  const [step, setStep] = useState(1);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const [userCred, setUserCred] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    phone: false,
    firstName: false,
    lastName: false,
    newPassword: false,
    confirmPassword: false,
    mismatch: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));

    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false, mismatch: false }));
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setUserCred((prev) => ({ ...prev, phone: value || "" }));
    if ((value || "").trim()) {
      setErrors((prev) => ({ ...prev, phone: false }));
    }
  };

  const validateStepOne = () => {
    const isInvalid = !userCred.phone.trim();
    setErrors((prev) => ({ ...prev, phone: isInvalid }));
    return !isInvalid;
  };

  const validateStepTwo = () => {
    const { firstName, lastName, newPassword, confirmPassword } = userCred;
    const newErrors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      newPassword: !newPassword.trim(),
      confirmPassword: !confirmPassword.trim(),
      mismatch: newPassword !== confirmPassword,
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((val) => val === false);
  };

  const handleNext = () => {
    if (validateStepOne()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!captchaToken) {
      setCaptchaError(true);
      alert("Please complete the CAPTCHA");
      return;
    }

    if (validateStepTwo()) {
      try {
        await axios.post("/api/send-otp-registration", {
          phoneNumber: userCred.phone,
          captchaToken,
        });

        // Axios automatically parses JSON response
        navigate("/otp-verification", {
          state: {
            // keep your existing flag so OTP screen can branch
            type: "register",
            phone: userCred.phone,
            password: userCred.newPassword,
            firstName: userCred.firstName,
            lastName: userCred.lastName,
          },
        });
      } catch (error: any) {
        console.error("Error during registration:", error);

        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;

          if (
            status === 403 &&
            data.message?.toLowerCase().includes("captcha")
          ) {
            alert("CAPTCHA verification failed. Please try again.");

            if (window.turnstile && turnstileWidgetId) {
              window.turnstile.reset(turnstileWidgetId);
            }

            setCaptchaToken("");
            setCaptchaError(true);
          } else {
            alert(data.message || "Something went wrong");
          }
        } else {
          // Network error or other error
          alert("Something went wrong. Please try again.");
        }
      }
    }
  };

  // Mount Turnstile widget manually
  useEffect(() => {
    if (step === 2 && window.turnstile && turnstileRef.current) {
      const widgetId = window.turnstile.render(turnstileRef.current, {
        sitekey: "0x4AAAAAABogye9PJul20McG",
        callback(token: string) {
          setCaptchaToken(token);
          setCaptchaError(false);
        },
        theme: "light",
      });

      setTurnstileWidgetId(widgetId);
    }
  }, [step]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <article className="auth-card">
      <div className="auth-card-wrapper d-flex flex-column">
        {step === 2 && (
          <Button
            className="back-btn cta-btn cta-btn--text d-flex align-items-center gap-2"
            onClick={() => setStep(1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Back
          </Button>
        )}
        <header className="register-header auth-card-header d-flex flex-column gap-2">
          <h1>Register</h1>
          <p>Create an account using your mobile number</p>
        </header>

        <Form className="register-form auth-card-form d-flex flex-column h-100">
          {step === 1 ? (
            <FormGroup>
              <Label htmlFor="phone">
                Mobile Number<span className="text-danger">*</span>
              </Label>
              <PhoneInput
                international
                defaultCountry="IN"
                value={userCred.phone}
                onChange={handlePhoneChange}
                className={`phone-input ${errors.phone ? "is-invalid" : ""}`}
              />
            </FormGroup>
          ) : (
            <>
              <FormGroup>
                <Label htmlFor="firstName">
                  First Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="e.g. John"
                  value={userCred.firstName}
                  onChange={handleChange}
                  invalid={errors.firstName}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="lastName">
                  Last Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="e.g. Doe"
                  value={userCred.lastName}
                  onChange={handleChange}
                  invalid={errors.lastName}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="newPassword">
                  New Password<span className="text-danger">*</span>
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={userCred.newPassword}
                  onChange={handleChange}
                  invalid={errors.newPassword}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">
                  Confirm Password<span className="text-danger">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={userCred.confirmPassword}
                  onChange={handleChange}
                  invalid={errors.confirmPassword || errors.mismatch}
                />
                {errors.mismatch && (
                  <small className="text-danger">Passwords do not match.</small>
                )}
              </FormGroup>

              <div ref={turnstileRef} className="mt-2" />

              {captchaError && (
                <div className="text-danger mt-2">
                  Please complete the CAPTCHA before submitting.
                </div>
              )}
            </>
          )}

          <footer className="d-flex flex-column gap-2">
            {step === 1 ? (
              <Button className="submit-btn mt-5" onClick={handleNext}>
                REGISTER
              </Button>
            ) : (
              <Button className="submit-btn" onClick={handleSubmit}>
                CREATE ACCOUNT
              </Button>
            )}
            <p className="text-center">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </footer>
        </Form>
      </div>
    </article>
  );
};

export default Register;
