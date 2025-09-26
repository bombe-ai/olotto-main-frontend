import { useState } from "react";
import { Link } from "react-router-dom";
import { FormGroup, Label, Input, Button, Form, Spinner } from "reactstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const phoneValid = !!phoneNumber.trim();
    const passValid = !!password.trim();
    setPhoneError(!phoneValid);
    setPasswordError(!passValid);
    return phoneValid && passValid;
  };

  const handleLogin = async () => {
    setLoginError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/login-phone", {
        phoneNumber,
        password,
      });

      const data = response.data;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("jhi-authenticationToken", data.id_token);
      window.location.href = "/";
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        setLoginError(data?.message || "Login failed. Please try again.");
      } else {
        setLoginError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="auth-card">
      <div className="auth-card-wrapper d-flex flex-column">
        <header className="auth-card-header d-flex flex-column gap-2">
          <h1>Login</h1>
          <p>Use your mobile number and password to login</p>
        </header>

        <Form
          className="auth-card-form d-flex flex-column h-100"
          onSubmit={(e) => e.preventDefault()}
        >
          {loginError && <div className="alert alert-danger">{loginError}</div>}

          <FormGroup>
            <Label for="phone">
              Mobile Number <span className="text-danger">*</span>
            </Label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={phoneNumber}
              onChange={(val) => {
                setPhoneNumber(val || "");
                setPhoneError(false);
              }}
              className={`phone-input ${phoneError ? "is-invalid" : ""}`}
            />
          </FormGroup>

          <FormGroup>
            <Label for="password">
              Password <span className="text-danger">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              invalid={passwordError}
            />
          </FormGroup>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <FormGroup check className="mb-0">
              <Input
                type="checkbox"
                id="rememberMe"
                className="form-check-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                data-cy="rememberMe"
              />
              <Label
                for="rememberMe"
                className="remember-me form-check-label text-muted"
              >
                Remember me
              </Label>
            </FormGroup>
            <Link
              className="d-block forgot-password text-primary"
              to="/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>

          <footer className="d-flex flex-column gap-2">
            <Button
              className="submit-btn mt-5"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
            <p className="text-center">
              Don&apos;t have an account? <a href="/register">Register here</a>
            </p>
          </footer>
        </Form>
      </div>
    </article>
  );
};

export default Login;
