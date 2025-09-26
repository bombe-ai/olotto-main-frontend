import { Route } from "react-router";

import ErrorBoundaryRoutes from "@shared/error/error-boundary-routes";

import Settings from "./settings/settings";
import Password from "./password/password";

const AccountRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="settings" element={<Settings />} />
      <Route path="password" element={<Password />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default AccountRoutes;
