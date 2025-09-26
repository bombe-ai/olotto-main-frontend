import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/config/store";
import { logout } from "@shared/reducers/authentication";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const authentication = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    dispatch(logout());
    if (authentication.logoutUrl) {
      window.location.href = authentication.logoutUrl;
    } else if (!authentication.isAuthenticated) {
      navigate("/");
    }
  }, [
    authentication.isAuthenticated,
    authentication.logoutUrl,
    dispatch,
    navigate,
  ]);

  return <div />;
};

export default Logout;
