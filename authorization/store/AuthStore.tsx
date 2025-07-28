import { create } from "zustand";
import { AuthError, AuthOtpResponse, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

async function loginWithOtp(
  username: string,
  email: string
): Promise<AuthOtpResponse | AuthError> {
  let response = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (response.error != null) {
    return response.error;
  }
  return response;
}

async function verifyOtp(
  email: string,
  token: string
): Promise<User | AuthError> {
  let { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) {
    return error;
  } else if (data && data.user) {
    return data.user;
  }
  return {
    name: "UnknownError",
    message: "Unknown error occurred during OTP verification",
  } as AuthError;
}

interface AuthStore {
  user: User | null;
  error: AuthError | null;
  loading: boolean;
  loginWithOtp: (username: string, email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  error: null,
  loading: false,

  loginWithOtp: async (username: string, email: string) => {
    set({ loading: true, error: null });
    console.log("Sending OTP for:", username, email);
    const response = await loginWithOtp(username, email);
    if (response instanceof AuthError) {
      set({ error: response, loading: false });
    } else {
      set({ loading: false });
    }
  },
  verifyOtp: async (email: string, token: string) => {
    const response = await verifyOtp(email, token);
    if (response instanceof AuthError) {
      set({ error: response });
    } else {
      set({ user: response });
    }
  },
}));

export default useAuthStore;
