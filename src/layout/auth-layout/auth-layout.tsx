import { Outlet, useNavigate } from "react-router-dom";

import "./auth-layout.scss";
const AuthLayout = () => {
  const navigate = useNavigate();
  return (
    <article className="auth-layout">
      <div className="white-bg d-lg-none position-fixed z-index-1 w-100 h-100"></div>
      <picture className="fullscreen-bg d-none d-lg-block position-fixed z-index-1 w-100 h-100">
        <img src="/images/LogIn.svg" alt="" />
      </picture>
      <div className="page-wrapper h-100 d-flex flex-column position-relative z-index-2">
        <picture
          className="logo d-none d-lg-flex position-absolute z-index-3"
          onClick={() => navigate("/")}
        >
          <img src="/images/O!-logo.png" alt="Omillionaire" />
        </picture>
        <Outlet />
      </div>
    </article>
  );
};

export default AuthLayout;
