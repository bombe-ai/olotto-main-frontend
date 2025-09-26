import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { useAppDispatch } from "@/app/config/store";
import { getSession } from "@/shared/reducers/authentication";
import { getProfile } from "@/shared/reducers/application-profile";
import ErrorBoundary from "@/shared/error/error-boundary";
import AppRoutes from "@/routes";
import ScrollToTop from "./components/scroll-to-top/scroll-to-top";
import MetaTags from "./components/meta-tag/meta-tag";
import CartSticker from "./components/cart-sticker/cart-sticker";

import "react-toastify/dist/ReactToastify.css";
import "@/app/config/dayjs";
import "./app.scss";

const baseHref =
  document.querySelector("base")?.getAttribute("href")?.replace(/\/$/, "") ||
  "";

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <BrowserRouter basename={baseHref}>
      <main className="main-container">
        <ToastContainer
          position="top-left"
          className="toastify-container"
          toastClassName="toastify-toast"
        />
        <ErrorBoundary>
          <ScrollToTop />
          <MetaTags />
          <AppRoutes />
          <CartSticker />
        </ErrorBoundary>
      </main>
    </BrowserRouter>
  );
};

export default App;
