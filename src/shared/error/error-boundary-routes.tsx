import { Route, Routes } from "react-router-dom";
import { Outlet, RoutesProps } from "react-router-dom";
import ErrorBoundary from "./error-boundary";

const ErrorBoundaryRoutes = ({ children }: RoutesProps) => {
  return (
    <Routes>
      <Route
        element={
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        }
      >
        {children}
      </Route>
    </Routes>
  );
};

export default ErrorBoundaryRoutes;
