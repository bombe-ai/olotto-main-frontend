import { Route } from "react-router-dom";
import AuthLayout from "./layout/auth-layout/auth-layout";
import Register from "./modules/auth-flow/register";
import Home from "./modules/home/home";
import ForgotPassword from "./modules/auth-flow/forgot-password";
import OTPVerification from "./modules/auth-flow/otp-verification";
import ResetPassword from "./modules/auth-flow/reset-password";
import ResetPasswordSuccess from "./modules/auth-flow/reset-password-success";
import MainLayout from "./layout/main-layout/main-layout";
import UserProfile from "./modules/user-profile/user-profile";
import MyProfile from "./modules/user-profile/my-profile";
import MyTickets from "./modules/user-profile/my-tickets";
import Winnings from "./modules/user-profile/winnings";
import Transactions from "./modules/user-profile/transactions";
import Help from "./modules/user-profile/help";
import ErrorBoundaryRoutes from "./shared/error/error-boundary-routes";
import Login from "./modules/login/login";
import Activate from "./modules/account/activate/activate";
import Logout from "./modules/login/logout";
import MyCart from "./modules/my-cart/my-cart";
import PurchaseSuccess from "./modules/purchase-success/purchase-success";
import PrivateRoute from "./shared/auth/private-route";
import RegistrationSuccess from "./modules/auth-flow/registration-success";
import Withdrawal from "./modules/withdrawal/withdrawal";
import DataPrivacy from "./modules/data-privacy/data-privacy";
import TermsAndConditions from "./modules/terms-and-conditions/terms-and-conditions";
import HowToParticipate from "./modules/how-to-participate/how-to-participate";
import Winners from "./modules/winners/winners";
import PastWinnings from "./modules/past-winnings/past-winnings";

const AppRoutes = () => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/reset-password-success"
            element={<ResetPasswordSuccess />}
          />
        </Route>

        <Route path="logout" element={<Logout />} />

        <Route path="account">
          <Route path="activate" element={<Activate />} />
          {/* <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route> */}
        </Route>

        {/* PUBLIC pages using MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          {/* Make ticket-purchase PUBLIC so redirects don't hit /login */}
          <Route path="ticket-purchase" element={<PurchaseSuccess />} />
          <Route path="how-to-participate" element={<HowToParticipate />} />
          <Route path="winners" element={<Winners />} />
          <Route path="past-winnings" element={<PastWinnings />} />
          <Route path="data-privacy-policy" element={<DataPrivacy />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        </Route>

        {/* PRIVATE area (requires ROLE_USER) */}
        <Route
          element={
            <PrivateRoute hasAnyAuthorities={["ROLE_USER"]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="cart" element={<MyCart />} />
          {/* Removed ticket-purchase from here */}
          <Route path="profile" element={<UserProfile />}>
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="my-tickets" element={<MyTickets />} />
            <Route path="winnings" element={<Winnings />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="help" element={<Help />} />
          </Route>
          <Route path="withdrawal" element={<Withdrawal />} />
        </Route>
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
