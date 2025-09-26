import { ReducersMapObject } from "@reduxjs/toolkit";
import { loadingBarReducer as loadingBar } from "react-redux-loading-bar";

import register from "@/modules/account/register/register.reducer";
import activate from "@/modules/account/activate/activate.reducer";
import password from "@/modules/account/password/password.reducer";
import settings from "@/modules/account/settings/settings.reducer";
import passwordReset from "@/modules/account/password-reset/password-reset.reducer";
import applicationProfile from "./application-profile";
import authentication from "./authentication";
import locale from "./locale";
import cart from "@shared/reducers/cart.reducer";

/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const rootReducer: ReducersMapObject = {
  authentication,
  locale,
  applicationProfile,
  register,
  activate,
  passwordReset,
  password,
  settings,
  loadingBar,
  cart,
};

export default rootReducer;
