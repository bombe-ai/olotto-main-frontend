import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  return (
    <article className="auth-card registration-success">
      <div className="auth-card-wrapper d-flex flex-column align-items-center text-center">
        <header className="auth-card-header d-none  d-lg-flex flex-column align-items-center gap-3">
          <svg
            aria-hidden="true"
            className="success-icon mb-3"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
          >
            <path
              d="M50.0026 8.3335C27.0859 8.3335 8.33594 27.0835 8.33594 50.0002C8.33594 72.9168 27.0859 91.6668 50.0026 91.6668C72.9193 91.6668 91.6693 72.9168 91.6693 50.0002C91.6693 27.0835 72.9193 8.3335 50.0026 8.3335ZM50.0026 83.3335C31.6276 83.3335 16.6693 68.3752 16.6693 50.0002C16.6693 31.6252 31.6276 16.6668 50.0026 16.6668C68.3776 16.6668 83.3359 31.6252 83.3359 50.0002C83.3359 68.3752 68.3776 83.3335 50.0026 83.3335ZM69.1276 31.5835L41.6693 59.0418L30.8776 48.2918L25.0026 54.1668L41.6693 70.8335L75.0026 37.5002L69.1276 31.5835Z"
              fill="currentColor"
            />
          </svg>
          <h1>Registration Successful</h1>
          <p>Your account has been created successfully.</p>
        </header>
        <header className="auth-card-header d-lg-none"></header>

        <div className="success-card-body d-flex flex-column justify-content-center align-items-center gap-3 bg-white w-100 h-100 d-lg-none position-relative ">
          <svg
            aria-hidden="true"
            className="success-icon mb-3 position-absolute"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
          >
            <path
              d="M50.0026 8.3335C27.0859 8.3335 8.33594 27.0835 8.33594 50.0002C8.33594 72.9168 27.0859 91.6668 50.0026 91.6668C72.9193 91.6668 91.6693 72.9168 91.6693 50.0002C91.6693 27.0835 72.9193 8.3335 50.0026 8.3335ZM50.0026 83.3335C31.6276 83.3335 16.6693 68.3752 16.6693 50.0002C16.6693 31.6252 31.6276 16.6668 50.0026 16.6668C68.3776 16.6668 83.3359 31.6252 83.3359 50.0002C83.3359 68.3752 68.3776 83.3335 50.0026 83.3335ZM69.1276 31.5835L41.6693 59.0418L30.8776 48.2918L25.0026 54.1668L41.6693 70.8335L75.0026 37.5002L69.1276 31.5835Z"
              fill="currentColor"
            />
          </svg>
          <h1>Registration Successful</h1>
          <p>Your account has been created successfully.</p>
          <Button
            className="submit-btn mt-auto mb-3"
            onClick={() => navigate("/login")}
          >
            Continue to Login
          </Button>
        </div>
        <Button
          className="submit-btn mt-auto d-none d-lg-block"
          onClick={() => navigate("/login")}
        >
          Continue to Login
        </Button>
      </div>
    </article>
  );
};

export default RegistrationSuccess;
