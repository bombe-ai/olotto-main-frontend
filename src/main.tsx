import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { bindActionCreators } from "redux";
import getStore from "@/app/config/store";
import { registerLocale } from "@/app/config/translation";
import setupAxiosInterceptors from "@/app/config/axios-interceptor";
import { clearAuthentication } from "@shared/reducers/authentication";
import { loadIcons } from "@/app/config/icon-loader";
import ErrorBoundary from "@shared/error/error-boundary";
import AppComponent from "@/app.tsx";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

const store = getStore();
registerLocale(store);
const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() =>
  actions.clearAuthentication("login.error.unauthorized")
);
loadIcons();

const root = createRoot(document.getElementById("root")!);
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <HelmetProvider>
        <AppComponent />
      </HelmetProvider>
    </Provider>
  </ErrorBoundary>
);
