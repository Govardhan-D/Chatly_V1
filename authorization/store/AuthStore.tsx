import { create } from "zustand";
import {
  AuthError,
  AuthOtpResponse,
  User,
  Session,
} from "@supabase/supabase-js";
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
  session: Session | null;
  error: AuthError | null;
  loading: boolean;
  email: string | null;
  loginWithOtp: (username: string, email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  error: null,
  loading: false,
  email: null,

  setSession: (session: Session | null) => {
    set({ session: session, user: session?.user ?? null });
  },

  loginWithOtp: async (username: string, email: string) => {
    set({ loading: true, error: null });
    console.log("Sending OTP for:", username, email);
    const response = await loginWithOtp(username, email);
    if (response instanceof AuthError) {
      console.error("Login error:", response);
      set({ error: response });
    } else {
      set({ email: email });
    }
    set({ loading: false });
  },

  verifyOtp: async (email: string, token: string) => {
    set({ loading: true });
    const response = await verifyOtp(email, token);
    if (response instanceof AuthError) {
      set({ error: response, loading: false });
    } else {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({
        user: response,
        session: session,
        loading: false,
        email: null,
      });
    }
  },

  logout: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      set({ error: error, loading: false });
    } else {
      set({
        user: null,
        session: null,
        loading: false,
        error: null,
        email: null,
      });
    }
  },
}));

// Initialize session on app load
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});

export default useAuthStore;
