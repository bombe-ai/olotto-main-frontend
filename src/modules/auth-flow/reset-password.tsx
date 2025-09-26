import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Form, FormGroup, Input, Label, Button, Spinner } from "reactstrap";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // Prefer token from OTP route state; fallback to query param ?token=...
  const stateToken = location.state?.resetToken as string | undefined;
  const queryToken = params.get("token") || undefined;
  const resetToken = useMemo(
    () => stateToken || queryToken,
    [stateToken, queryToken]
  );

  const [userCred, setUserCred] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: false,
    confirmPassword: false,
    mismatch: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [alertOk, setAlertOk] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: !value.trim(), mismatch: false }));
    setAlertError(null);
  };

  const validate = () => {
    const { newPassword, confirmPassword } = userCred;
    const nextErrors = {
      newPassword: !newPassword.trim(),
      confirmPassword: !confirmPassword.trim(),
      mismatch: newPassword !== confirmPassword,
    };
    setErrors(nextErrors);
    if (!resetToken) {
      setAlertError(
        "Reset link is missing or invalid. Please start the Forgot Password flow again."
      );
      return false;
    }
    if (
      nextErrors.newPassword ||
      nextErrors.confirmPassword ||
      nextErrors.mismatch
    )
      return false;
    if (userCred.newPassword.length < 8) {
      setAlertError("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setAlertError(null);
    setAlertOk(null);

    try {
      await axios.post("/api/forgot-password/reset", {
        resetToken, // object-shorthand friendly (variable name matches key)
        newPassword: userCred.newPassword,
      });

      navigate("/reset-password-success");
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 410) {
          setAlertError(
            "This reset link has expired or was already used. Please request a new one."
          );
        } else {
          setAlertError(
            data?.message || "Failed to reset password. Please try again."
          );
        }
      } else {
        setAlertError("Network error. Please try again.");
      }
    } finally {
      setSubmitting(false);
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
          <h1>Reset Password</h1>
          <p>Set a new password for your account</p>
        </header>

        <Form
          className="auth-card-form d-flex flex-column"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {!resetToken && (
            <div className="alert alert-warning">
              Missing reset token. Go to{" "}
              <a href="/forgot-password">Forgot Password</a> and try again.
            </div>
          )}

          {alertError && <div className="alert alert-danger">{alertError}</div>}
          {alertOk && <div className="alert alert-success">{alertOk}</div>}

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
            <small className="text-muted">
              Minimum 8 characters. Use a mix of letters and numbers.
            </small>
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

          <footer className="d-flex flex-column gap-3">
            <Button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!resetToken || submitting}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" /> Saving…
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </footer>
        </Form>
      </div>
    </article>
  );
};

export default ResetPassword;
