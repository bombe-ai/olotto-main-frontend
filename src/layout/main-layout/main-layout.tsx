import { Outlet } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import "./main-layout.scss";

const MainLayout = () => {
  return (
    <article className="main-layout d-flex flex-column min-vh-100">
      <Header />
      <div className="page-wrapper h-100 w-100 d-flex flex-column justify-content-center align-items-center position-relative">
        <Outlet />
        <div className="whats-app-floaty position-fixed">
          <a
            href="https://wa.me/918129170165"
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <img src="/images/whatsapp-icon.svg" alt="Chat on WhatsApp" />
          </a>
        </div>
      </div>
      <Footer />
    </article>
  );
};

export default MainLayout;
