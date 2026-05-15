"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUserState {
  email: string;
  nickname: string;
  profile_image: string;
  socialLoginType?: string;
}

type LoginState = {
  isLogin: boolean;
  accessToken: string;
  refreshToken: string;
  setLoginState: (
    isLogin: boolean,
    accessToken: string,
    refreshToken: string,
  ) => void;
  user: IUserState | null;
  setUser: (user: IUserState | null) => void;
};

export const useAuthStore = create<LoginState>(
  persist(
    (set) => ({
      isLogin: false,
      accessToken: "",
      refreshToken: "",
      setLoginState: (isLogin, accessToken, refreshToken) =>
        set({
          isLogin,
          accessToken,
          refreshToken,
        }),
      user: null,
      setUser: (user: IUserState | null) => set({ user }),
    }),
    {
      name: "user-storage",
    },
  ) as (set: (fn: (state: LoginState) => LoginState) => void) => LoginState,
);
