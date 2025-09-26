import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { serializeAxiosError } from "@shared/reducers/reducer.utils";

const initialState = {
  loading: false,
  registrationSuccess: false,
  registrationFailure: false,
  errorMessage: null as string | null,
  successMessage: null as string | null,
};

export type RegisterState = Readonly<typeof initialState>;

// Actions

export const handleRegister = createAsyncThunk(
  "register/create_account",
  async (data: {
    login: string;
    email: string;
    password: string;
    langKey?: string;
  }) => axios.post<any>("api/register", data),
  { serializeError: serializeAxiosError }
);

export const RegisterSlice = createSlice({
  name: "register",
  initialState: initialState as RegisterState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(handleRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleRegister.rejected, (state, action) => ({
        ...initialState,
        registrationFailure: true,
        errorMessage: action.error.message || "Registration failed",
      }))
      .addCase(handleRegister.fulfilled, () => ({
        ...initialState,
        registrationSuccess: true,
        successMessage: "register.messages.success",
      }));
  },
});

export const { reset } = RegisterSlice.actions;

// Reducer
export default RegisterSlice.reducer;
