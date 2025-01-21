import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/types";
import { logout } from "@/actions/auth";

//session data type
export interface SessionData {
  user: User;
  accessToken: string;
  refreshToken: string;
}
//store interface
interface UserSessionStore {
  user: User | null;
  setUser: (userData: User) => Promise<void>;
  clearSession: () => Promise<void>;
}
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}
//create zustand store persistence
export const useUserSession = create<UserSessionStore>()(
  persist(
    (set) => ({
      user: null,
      //Method to set user session via server action
      setUser: async (userData) => {
        try {
          set({ user: userData });
        } catch (error) {
          console.log("session creation error:", error);
          //optionaly handle error(e.g show notification)
        }
      },
      //Method to clear session via sever action
      clearSession: async () => {
        try {
          // call logout server action
          const result = await logout();
          if (result.success) {
            // reset user in local storage
            set({ user: null });
          } else {
            throw new Error("logout failed");
          }
        } catch (error) {
          console.log("Logout error:", error);
          //optionally handle error (e.g,  show notification)
        }
      }
    }),
    { name: "user-session", partialize: (state) => ({ user: state.user }) }
  )
);
